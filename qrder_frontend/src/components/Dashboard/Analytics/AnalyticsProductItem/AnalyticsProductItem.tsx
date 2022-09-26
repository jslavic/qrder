import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { convertToISODate } from '../../../../helpers/general/convertToISODate';
import useFetch from '../../../../hooks/useFetch';
import { DateRange } from 'react-day-picker';
import ErrorSection from '../../DashboardCommon/ErrorSection';
import LoadingSection from '../../DashboardCommon/LoadingSection';
import { URL } from '../../../../constants/config/url';
import {
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import CountUp from 'react-countup';
import DatePicker from '../../../Common/DatePicker/DatePicker';
import { formatPrice } from '../../../../helpers/general/formatPrice';
import { formatTwoDigits } from '../../../../helpers/general/formatTwoDigits';
import SearchBar from '../../../Common/SearchBar/SearchBar';
import AnalyticsSearchProductItem, {
  SearchProduct,
} from '../AnalyticsSearchProductItem/AnalyticsSearchProductItem';

import { ReactComponent as ChartProfit } from '../../../../assets/chart-line-up.svg';

import styles from './AnalyticsProductItem.module.css';
import analyticsStyles from '../Analytics.module.css';
import { daysBetween } from '../../../../helpers/general/daysBetween';
import { getDayOfYear } from '../../../../helpers/general/getDayOfYear';
import { dayOfYearToString } from '../../../../helpers/general/dayOfYearToString';
import { ProductDto } from '../../../../constants/dto/items/product.dto';
import { getDiscountDate } from '../../../../helpers/discount/getDiscountDate.helper';
import { RepeatedDays } from '../../../../constants/enums/discountEnums/repeatedDays.enum';
import { RepeatedDiscount } from '../../../../constants/enums/discountEnums/repeatedDiscount';

enum SearchType {
  BY_HOUR = 'hour',
  BY_DAY = 'day',
}

type Props = {};

type HourlyChartData = {
  _id: number;
  sales: number;
  items: number;
}[];

type DailyChartData = {
  _id: number;
  sales: number;
  items: number;
  date: string;
}[];

type DiscountData = {
  _id: number;
  potentialEarnings: number;
  discountedEarnings: number;
  items: number;
  hoursSum: number;
  name: string;
  amount: string;
  type: 'PERCENTAGE' | 'AMOUNT';
  from: string;
  to: string;
  repeated: RepeatedDiscount;
  repeatedDay: RepeatedDays;
}[];

type NoDiscountData = {
  _id: null;
  potentialEarnings: number;
  discountedEarnings: number;
  items: number;
  hoursSum: number;
} | null;

type AllDiscountData = {
  discounts: DiscountData;
  noDiscountData: NoDiscountData;
};

type OtherItemSales = {
  _id: number;
  timesCombined: number;
  name: string;
  imageUrl: string;
}[];

type FetchData = {
  product: ProductDto;
  hourlySalesData: HourlyChartData;
  dailySalesData: DailyChartData;
  discountData: AllDiscountData;
  otherItemSales: OtherItemSales;
};

const AnalyticsProductItem = (props: Props) => {
  const [searchParams] = useSearchParams();

  const productId = searchParams.get('id');

  const [chartType, setChartType] = useState(SearchType.BY_HOUR);
  const [datePickerRange, setDatePickerRange] = useState<DateRange | undefined>(
    {
      from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29),
      to: new Date(Date.now()),
    }
  );
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29),
    to: new Date(Date.now()),
  });

  const [analyticsUrl, setAnalyticsUrl] = useState(
    `${URL}/analytics/product?id=${productId}&after=${convertToISODate(
      selectedRange.from
    )}&before=${convertToISODate(selectedRange.to)}`
  );

  console.log(analyticsUrl);

  const { state: fetchState, doFetch } = useFetch<FetchData>(analyticsUrl);

  const [product, setProudct] = useState<ProductDto | null>(null);
  const [hourlyChartData, setHourlyChartData] = useState<HourlyChartData>([]);
  const [dailyChartData, setDailyChartData] = useState<DailyChartData>([]);
  const [discountData, setDiscountData] = useState<DiscountData>([]);
  const [noDiscountData, setNoDiscountData] = useState<NoDiscountData>(null);
  const [otherItemSales, setOtherItemSales] = useState<OtherItemSales>([]);

  //   const [sales, setSales] = useState<ProductStatistics[]>([]);

  const salesDifference = useRef(0);

  const totalEarnings = useRef(0);
  const totalItems = useRef(0);

  useEffect(() => {
    setAnalyticsUrl(
      `${URL}/analytics/product?id=${productId}&after=${convertToISODate(
        selectedRange.from
      )}&before=${convertToISODate(selectedRange.to)}`
    );
  }, [selectedRange, chartType, productId]);

  useEffect(() => {
    doFetch({ method: 'GET', credentials: 'include' });
  }, [doFetch, analyticsUrl]);

  useEffect(() => {
    if (fetchState.data) {
      setProudct(fetchState.data.product);
      setDiscountData(fetchState.data.discountData.discounts);
      setNoDiscountData(fetchState.data.discountData.noDiscountData);
      setOtherItemSales(fetchState.data.otherItemSales);

      const emptyHourlyChartData = Array.from(Array(24).keys()).map((x) => ({
        _id: x,
        sales: 0,
        items: 0,
      }));
      totalEarnings.current = 0;
      totalItems.current = 0;
      fetchState.data.hourlySalesData.forEach((item) => {
        totalItems.current += item.items;
        totalEarnings.current += item.sales;
        emptyHourlyChartData[item._id] = item;
      });
      setHourlyChartData(emptyHourlyChartData);

      const daysRange = daysBetween(selectedRange.from, selectedRange.to) + 1;
      const fromDayOfYear =
        getDayOfYear(new Date(selectedRange.to)) - daysRange;
      const emptyDailyChartData = Array.from(Array(daysRange).keys()).map(
        (x) => ({
          _id: x + fromDayOfYear,
          date: dayOfYearToString(x + fromDayOfYear),
          sales: 0,
          items: 0,
        })
      );
      fetchState.data.dailySalesData.forEach((item) => {
        emptyDailyChartData[item._id - fromDayOfYear] = {
          ...item,
          date: emptyDailyChartData[item._id - fromDayOfYear].date,
        };
      });
      setDailyChartData(emptyDailyChartData);
      salesDifference.current =
        Math.round(
          ((emptyDailyChartData.at(-1)!.sales -
            (emptyDailyChartData.at(-2)?.sales ?? 0)) /
            (emptyDailyChartData.at(-2)?.sales ?? 100)) *
            100 *
            100
        ) / 100;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchState.data]);

  if (fetchState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          doFetch({ method: 'GET', credentials: 'include' })
        }
      />
    );

  if (fetchState.isLoading) return <LoadingSection />;

  if (fetchState.data)
    return (
      <div className={analyticsStyles.mainBox}>
        <div className={analyticsStyles.titleBox}>
          <h2 className={styles.title}>
            {product ? (
              <>
                <img
                  src='https://d17zv3ray5yxvp.cloudfront.net/variants/6niNLYV2F6VaqCoseixK9VVS/57ed05bea98bceae5f0eaada26b69cee6c61471d3030f7123d212844a35eba04'
                  alt={product.name}
                  className={styles.titleImg}
                />
                {product.name}
              </>
            ) : (
              'Analiza Proizvoda'
            )}
          </h2>
          <SearchBar<SearchProduct>
            placeholder='Analizirajte prema proizvodu'
            fetchUrl={`${URL}/product/search`}
            mapFunc={(results, query) =>
              results
                .sort((a, b) => {
                  const regex = new RegExp(query, 'i');
                  return (
                    (regex.exec(a.name)?.index ?? Infinity) -
                    (regex.exec(b.name)?.index ?? Infinity)
                  );
                })
                .map((product) => (
                  <AnalyticsSearchProductItem product={product} />
                ))
            }
          />
        </div>
        <div className={analyticsStyles.gridBox}>
          <div className={styles.secondChartBox}>
            <div className={analyticsStyles.chartHeader}>
              <div className={analyticsStyles.chartInfo}>
                <p className={analyticsStyles.chartTitle}>Prihodi po satu</p>
                <div className={analyticsStyles.salesInfo}>
                  <p className={styles.todaySales}>
                    <CountUp
                      start={0}
                      end={totalEarnings.current}
                      duration={2}
                      decimals={2}
                      decimal=','
                      suffix='kn'
                    />
                  </p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width='100%' height={220}>
              <LineChart
                data={hourlyChartData}
                margin={{ top: 20, right: 0, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey='_id'
                  axisLine={false}
                  tickMargin={6}
                  tick={{
                    fontSize: '10px',
                    strokeWidth: 0,
                    fill: 'var(--black-high-opacity)',
                  }}
                  minTickGap={10}
                  tickLine={false}
                  tickFormatter={(value: string) => `${value}h`}
                  strokeDasharray='5 3'
                />
                <YAxis
                  tick={{
                    fontSize: '12px',
                    strokeWidth: 0,
                    fill: 'var(--black-high-opacity)',
                  }}
                  unit='kn'
                  minTickGap={0}
                  tickMargin={16}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomDayTooltip />} />
                <CartesianGrid
                  vertical={false}
                  stroke='var(--black-mid-opacity)'
                  strokeDasharray='5 4'
                  strokeWidth={1}
                />
                <Line
                  type='monotone'
                  unit={'kn'}
                  dataKey='sales'
                  name='Prodaje'
                  stroke='var(--color-blue)'
                  strokeWidth={3}
                  fill='var(--color-blue)'
                  dot={false}
                  activeDot={{
                    stroke: 'var(--color-blue)',
                    strokeWidth: 1.8,
                    fill: 'var(--color-blue)',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.smallBox}>
            <p className={styles.otherItemTitle}>
              Najčešće kombinirani proizvodi
            </p>
            <p className={styles.otherItemDesc}>
              Koliko puta su ostali proizvodi naručeni zajedno s{' '}
              {product?.name || 'izabranim proizvodom'}
            </p>
            <div className={styles.otherItemList}>
              {otherItemSales.map((item) => (
                <div className={styles.otherItemBox} key={item._id}>
                  <img
                    src='https://d17zv3ray5yxvp.cloudfront.net/variants/6niNLYV2F6VaqCoseixK9VVS/57ed05bea98bceae5f0eaada26b69cee6c61471d3030f7123d212844a35eba04'
                    alt={item.name}
                    className={styles.otherItemImg}
                  />
                  <div className={styles.otherItemInfo}>
                    <p className={styles.otherItemName}>{item.name}</p>
                    <p className={styles.otherItemOrders}>
                      {item.timesCombined} puta
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.smallBox}>
            <p className={styles.discountTitle}>Analiza popusta</p>
            <div className={styles.discountBox}>
              {discountData.map((discount) => {
                const netPerHour =
                  discount.discountedEarnings / discount.hoursSum;
                const itemsPerHour = discount.items / discount.hoursSum;
                const fromDate = new Date(discount.from);
                const toDate = new Date(discount.to);

                return (
                  <div className={styles.discountItem}>
                    <div className={styles.discountNameBox}>
                      <p className={styles.discountName}>
                        <span>{discount.name}</span>{' '}
                        <span className={styles.discountAmount}>
                          (
                          {discount.type === 'PERCENTAGE'
                            ? `${discount.amount}%`
                            : `${discount.amount}kn`}
                          )
                        </span>
                      </p>
                      <p className={styles.discountDate}>
                        <p>od {getDiscountDate(discount.repeated, fromDate)}</p>
                        <p>do {getDiscountDate(discount.repeated, toDate)}</p>
                      </p>
                    </div>
                    <div>
                      <div className={styles.discountStatSection}>
                        <div className={styles.discountStat}>
                          <p className={styles.discountText}>
                            Izgubljeno zbog popusta:
                          </p>
                          <p className={styles.discountNumber}>
                            {formatPrice(
                              discount.potentialEarnings -
                                discount.discountedEarnings
                            )}
                            kn
                          </p>
                        </div>
                      </div>
                      <p className={styles.subsectionTitlte}>Ukupno</p>
                      <div className={styles.discountStatSection}>
                        <div className={styles.discountStat}>
                          <p className={styles.discountText}>Prihodi:</p>
                          <p className={styles.discountNumber}>
                            {formatPrice(discount.discountedEarnings)}kn
                          </p>
                        </div>
                        {noDiscountData && (
                          <p className={styles.discountPercentage}>
                            (
                            {(
                              (discount.discountedEarnings /
                                noDiscountData.discountedEarnings) *
                              100
                            ).toFixed(2)}
                            % više nego bez popusta)
                          </p>
                        )}
                      </div>
                      <div className={styles.discountStatSection}>
                        <div className={styles.discountStat}>
                          <p className={styles.discountText}>
                            Proizvoda prodano:
                          </p>
                          <p className={styles.discountNumber}>
                            {(discount.items * 100) % 100 === 0
                              ? discount.items
                              : discount.items.toFixed(2)}
                          </p>
                        </div>
                        {noDiscountData && (
                          <p className={styles.discountPercentage}>
                            (
                            {(discount.items / noDiscountData.items).toFixed(2)}
                            % više nego bez popusta)
                          </p>
                        )}
                      </div>
                      <p className={styles.subsectionTitlte}>Po satu</p>
                      <div className={styles.discountStatSection}>
                        <div className={styles.discountStat}>
                          <p className={styles.discountText}>Prihodi:</p>
                          <p className={styles.discountNumber}>
                            {formatPrice(
                              discount.discountedEarnings / discount.hoursSum
                            )}
                            kn
                          </p>
                        </div>
                        {noDiscountData && (
                          <p className={styles.discountPercentage}>
                            (
                            {(
                              (discount.discountedEarnings /
                                discount.hoursSum /
                                (noDiscountData.discountedEarnings /
                                  noDiscountData.hoursSum)) *
                              100
                            ).toFixed(2)}
                            % više nego bez popusta)
                          </p>
                        )}
                      </div>
                      <div className={styles.discountStatSection}>
                        <div className={styles.discountStat}>
                          <p className={styles.discountText}>
                            Proizvoda prodano:
                          </p>
                          <p className={styles.discountNumber}>
                            {((discount.items / discount.hoursSum) * 100) %
                              100 ===
                            0
                              ? discount.items / discount.hoursSum
                              : (discount.items / discount.hoursSum).toFixed(2)}
                          </p>
                        </div>
                        {noDiscountData && (
                          <p className={styles.discountPercentage}>
                            (
                            {(
                              (discount.items /
                                discount.hoursSum /
                                (noDiscountData.items /
                                  noDiscountData.hoursSum)) *
                              100
                            ).toFixed(2)}
                            % više nego bez popusta)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={analyticsStyles.chartBox}>
            <div className={analyticsStyles.chartHeader}>
              <div className={analyticsStyles.chartInfo}>
                <p className={analyticsStyles.chartTitle}>Prihodi po danu</p>
                <div className={analyticsStyles.salesInfo}>
                  <p className={analyticsStyles.todaySales}>
                    <CountUp
                      start={0}
                      end={dailyChartData.at(-1)?.sales || 0}
                      duration={2}
                      decimals={2}
                      decimal=','
                      suffix='kn'
                    />
                  </p>
                  <p
                    className={`${analyticsStyles.todayPercentage} ${
                      salesDifference.current <= 0
                        ? analyticsStyles.todayPercentageNegative
                        : analyticsStyles.todayPercentagePositive
                    }`}
                  >
                    <ChartProfit className={analyticsStyles.chartIcon} />
                    <CountUp
                      start={0}
                      end={Math.abs(salesDifference.current)}
                      duration={2}
                      decimals={2}
                      decimal='.'
                      suffix='%'
                    />
                  </p>
                </div>
              </div>
              <div>
                <DatePicker
                  selectedRange={datePickerRange}
                  setSelectedRange={setDatePickerRange}
                  onSearch={() => {
                    console.log('searching');
                    if (datePickerRange && datePickerRange.from)
                      setSelectedRange({
                        from: datePickerRange.from,
                        to: datePickerRange.to || datePickerRange.from,
                      });
                  }}
                  className={analyticsStyles.datePicker}
                  maxDate={new Date()}
                />
              </div>
            </div>
            <ResponsiveContainer width='100%' height={220}>
              <LineChart
                data={dailyChartData}
                margin={{ top: 20, right: 0, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey='date'
                  axisLine={false}
                  tickMargin={6}
                  tick={{
                    fontSize: '10px',
                    strokeWidth: 0,
                    fill: 'var(--black-high-opacity)',
                  }}
                  minTickGap={10}
                  tickLine={false}
                  tickFormatter={(value: string) =>
                    `${value.split('/')[0]}. ${value.split('/')[1]}.`
                  }
                  strokeDasharray='5 3'
                />
                <YAxis
                  tick={{
                    fontSize: '12px',
                    strokeWidth: 0,
                    fill: 'var(--black-high-opacity)',
                  }}
                  unit='kn'
                  minTickGap={0}
                  tickMargin={16}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomDateTooltip />} />
                <CartesianGrid
                  vertical={false}
                  stroke='var(--black-mid-opacity)'
                  strokeDasharray='5 4'
                  strokeWidth={1}
                />
                <Line
                  type='monotone'
                  unit={'kn'}
                  dataKey='sales'
                  name='Prodaje'
                  stroke='var(--color-primary-dark)'
                  strokeWidth={3}
                  fill='var(--color-primary-dark)'
                  dot={false}
                  activeDot={{
                    stroke: 'var(--color-primary-dark)',
                    strokeWidth: 1.8,
                    fill: 'var(--color-primary-dark)',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );

  return <LoadingSection />;
};

const CustomDayTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length)
    return (
      <div className={styles.tooltipBox}>
        <p className={analyticsStyles.tooltipPrice}>
          {formatPrice(payload[0].value)}kn
        </p>
        <p className={analyticsStyles.tooltipLabel}>
          {payload[0].payload.items > 0 &&
            (payload[0].payload.items === 1
              ? '1 proizvod prodan'
              : `${payload[0].payload.items} proizvoda prodano`)}
        </p>
        <p className={analyticsStyles.tooltipLabel}>
          {label === 0 ? 24 : formatTwoDigits(label)}:00 -{' '}
          {formatTwoDigits(label + 1)}:00
        </p>
      </div>
    );

  return null;
};

const CustomDateTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length)
    return (
      <div className={analyticsStyles.tooltipBox}>
        <p className={analyticsStyles.tooltipPrice}>
          {formatPrice(payload[0].value)}kn
        </p>
        <p className={analyticsStyles.tooltipLabel}>
          {payload[0].payload.items > 0 &&
            (payload[0].payload.items === 1
              ? '1 proizvod prodan'
              : `${payload[0].payload.items} proizvoda prodano`)}
        </p>
        <p className={analyticsStyles.tooltipLabel}>{label}</p>
      </div>
    );
  return null;
};

export default AnalyticsProductItem;
