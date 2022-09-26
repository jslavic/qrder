import React, { useEffect, useRef, useState } from 'react';
import { URL } from '../../../constants/config/url';
import { getDayOfYear } from '../../../helpers/general/getDayOfYear';
import { dayOfYearToString } from '../../../helpers/general/dayOfYearToString';
import { formatPrice } from '../../../helpers/general/formatPrice';
import useFetch from '../../../hooks/useFetch';
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
import { DateRange } from 'react-day-picker';

import { ReactComponent as ChartProfit } from '../../../assets/chart-line-up.svg';
import { ReactComponent as BalanceIcon } from '../../../assets/bank.svg';
import { ReactComponent as EarningsIcon } from '../../../assets/coin-cash.svg';
import { ReactComponent as PercentageIcon } from '../../../assets/percentage.svg';
import { ReactComponent as ShoppingIcon } from '../../../assets/shopping-bag.svg';

import styles from './Analytics.module.css';
import { getCurrentBalanceArray } from '../../../helpers/general/getCurrentBalanceArray';
import LoadingSection from '../DashboardCommon/LoadingSection';
import ErrorSection from '../DashboardCommon/ErrorSection';
import SearchBar from '../../Common/SearchBar/SearchBar';
import DatePicker from '../../Common/DatePicker/DatePicker';
import AnalyticsSearchProductItem, {
  SearchProduct,
} from './AnalyticsSearchProductItem/AnalyticsSearchProductItem';
import { daysBetween } from '../../../helpers/general/daysBetween';
import { convertToISODate } from '../../../helpers/general/convertToISODate';

type FetchData = {
  chartData: ChartData;
  balance: BalanceData;
  productStatistics: ProductStatistics[];
  totalItems: number;
};

type ChartData = { _id: number; sales: number; date: string }[];

type BalanceData = {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
};

type ProductStatistics = {
  _id: number;
  earnings: number;
  itemsSold: number;
  name: string;
  imageUrl: string;
};

type Props = {};

const Analytics = (props: Props) => {
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
    `${URL}/analytics?after=${convertToISODate(
      selectedRange.from
    )}&before=${convertToISODate(selectedRange.to)}`
  );

  console.log(analyticsUrl);

  const { state: fetchState, doFetch } = useFetch<FetchData>(analyticsUrl);

  const [chartData, setChartData] = useState<ChartData>([]);
  const [sales, setSales] = useState<ProductStatistics[]>([]);

  const salesDifference = useRef(0);
  const balance = useRef(0);
  const monthlyEarnings = useRef(0);
  const itemsSold = useRef(0);

  useEffect(() => {
    setAnalyticsUrl(
      `${URL}/analytics?after=${convertToISODate(
        selectedRange.from
      )}&before=${convertToISODate(selectedRange.to)}`
    );
  }, [selectedRange]);

  useEffect(() => {
    doFetch({ method: 'GET', credentials: 'include' });
  }, [doFetch, analyticsUrl]);

  console.log('THE DATES', datePickerRange);

  useEffect(() => {
    if (fetchState.data) {
      setSales(fetchState.data.productStatistics);
      const balances = getCurrentBalanceArray(fetchState.data.balance);
      balance.current = (balances[0].amount || 0) / 100;
      itemsSold.current = fetchState.data.totalItems;
      const daysRange = daysBetween(selectedRange.from, selectedRange.to) + 1;
      const fromDayOfYear =
        getDayOfYear(new Date(selectedRange.to)) - daysRange;
      const emptyChartData = Array.from(Array(daysRange).keys()).map((x) => ({
        _id: x + fromDayOfYear,
        date: dayOfYearToString(x + fromDayOfYear),
        sales: 0,
      }));
      monthlyEarnings.current = 0;
      fetchState.data.chartData.forEach((item) => {
        console.log(item.sales);
        monthlyEarnings.current += item.sales;
        emptyChartData[item._id - fromDayOfYear] = item;
      });
      setChartData(emptyChartData);
      salesDifference.current =
        Math.round(
          ((emptyChartData.at(-1)!.sales -
            (emptyChartData.at(-2)?.sales ?? 0)) /
            (emptyChartData.at(-2)?.sales || 100)) *
            100 *
            100
        ) / 100;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchState.data]);

  console.log(chartData);

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
      (chartData.length > 0 && (
        <div className={styles.mainBox}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>Analiza Narudžbi</h2>
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
          <div className={styles.gridBox}>
            <div className={styles.chartBox}>
              <div className={styles.chartHeader}>
                <div className={styles.chartInfo}>
                  <p className={styles.chartTitle}>Prihodi</p>
                  <div className={styles.salesInfo}>
                    <p className={styles.todaySales}>
                      <CountUp
                        start={0}
                        end={chartData.at(-1)?.sales || 0}
                        duration={2}
                        decimals={2}
                        decimal=','
                        suffix='kn'
                      />
                    </p>
                    <p
                      className={`${styles.todayPercentage} ${
                        salesDifference.current <= 0
                          ? styles.todayPercentageNegative
                          : styles.todayPercentagePositive
                      }`}
                    >
                      <ChartProfit className={styles.chartIcon} />
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
                  {' '}
                  <DatePicker
                    selectedRange={datePickerRange}
                    setSelectedRange={setDatePickerRange}
                    onSearch={() => {
                      if (datePickerRange && datePickerRange.from)
                        setSelectedRange({
                          from: datePickerRange.from,
                          to: datePickerRange.to || datePickerRange.from,
                        });
                    }}
                    className={styles.datePicker}
                    maxDate={new Date()}
                  />
                </div>
              </div>
              <ResponsiveContainer width='100%' height={220}>
                <LineChart
                  data={chartData}
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
                  <Tooltip content={<CustomTooltip />} />
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
            <div className={`${styles.balanceBox} ${styles.smallBox}`}>
              <div className={styles.iconBox}>
                <BalanceIcon className={styles.icon} />
              </div>
              <div>
                <p className={styles.desc}>Stanje na računu</p>
                <p className={styles.amount}>
                  <CountUp
                    start={0}
                    end={balance.current}
                    duration={2}
                    decimals={2}
                    separator={'.'}
                    decimal=','
                    suffix='kn'
                  />
                </p>
              </div>
            </div>
            <div className={`${styles.earningsBox} ${styles.smallBox}`}>
              <div className={styles.iconBox}>
                <EarningsIcon className={styles.icon} />
              </div>
              <div>
                <p className={styles.desc}>Profit</p>
                <p className={styles.amount}>
                  <CountUp
                    start={0}
                    end={monthlyEarnings.current}
                    duration={2}
                    decimals={2}
                    separator={'.'}
                    decimal=','
                    suffix='kn'
                  />
                </p>
              </div>
            </div>
            <div className={`${styles.avarageBox} ${styles.smallBox}`}>
              <div className={styles.iconBox}>
                <PercentageIcon className={styles.icon} />
              </div>
              <div>
                <p className={styles.desc}>Prosječni dnevni profit</p>
                <p className={styles.amount}>
                  <CountUp
                    start={0}
                    end={monthlyEarnings.current / chartData.length}
                    duration={2}
                    decimals={2}
                    separator={'.'}
                    decimal=','
                    suffix='kn'
                  />
                </p>
              </div>
            </div>
            <div className={styles.salesBox}>
              <p className={styles.salesHeading}>Najprodavaniji proizvodi</p>
              <div className={styles.salesTableWrapper}>
                <table className={styles.salesTable}>
                  <thead>
                    <tr>
                      <th>Ime proizvoda</th>
                      <th>Količina</th>
                      <th>Neto prihodi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((product) => (
                      <tr className={styles.salesRow}>
                        <td className={styles.salesName} valign='top'>
                          {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} />
                          )}
                          <span>{product.name}</span>
                        </td>
                        <td className={styles.salesAmount} valign='top'>
                          {product.itemsSold}
                        </td>
                        <td
                          align='right'
                          className={styles.salesEarnings}
                          valign='top'
                        >
                          {formatPrice(product.earnings)}kn
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={`${styles.itemSoldBox} ${styles.smallBox}`}>
              <div className={styles.iconBox}>
                <ShoppingIcon className={styles.icon} />
              </div>
              <div>
                <p className={styles.desc}>Proizvoda prodano</p>
                <p className={styles.amount}>
                  <CountUp start={0} end={itemsSold.current} duration={2} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )) ||
      null
    );

  return <LoadingSection />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length)
    return (
      <div className={styles.tooltipBox}>
        <p className={styles.tooltipPrice}>{formatPrice(payload[0].value)}kn</p>
        <p className={styles.tooltipLabel}>{label}</p>
      </div>
    );
  return null;
};

export default Analytics;
