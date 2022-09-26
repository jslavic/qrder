import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { OrderItemType } from '../../../constants/types/orderItem.types';
import { URL } from '../../../constants/config/url';
import useFetch from '../../../hooks/useFetch';
import OrderItem from './OrderItem/OrderItem';
import LoadingSection from '../DashboardCommon/LoadingSection';
import ErrorSection from '../DashboardCommon/ErrorSection';
import { OrderStatus } from '../../../constants/enums/orderEnums/orderStatus.enums';
import { ToastContainer, toast } from 'react-toastify';

import styles from './Orders.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { OrdersState } from '../../../constants/types/orderState.types';

type Props = {};

type FetchState = {
  liveOrders: OrdersState;
  previousOrders: OrdersState;
};

const getOrdersUrl = `${URL}/order`;

const Orders = (props: Props) => {
  const { state: ordersState, doFetch } = useFetch<FetchState>(getOrdersUrl);

  const [previousOrders, setPreviousOrders] = useState<OrdersState>({
    orders: [],
    hasMore: false,
  });
  const [liveOrders, setLiveOrders] = useState<OrdersState>({
    orders: [],
    hasMore: false,
  });

  const confirmOrder = async (id: string) => {
    const orderIndex = liveOrders?.orders.findIndex(
      (order) => order._id === id
    );
    if (orderIndex === -1) return;

    const confirmResposne = await fetch(`${getOrdersUrl}/confirm/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (!confirmResposne.ok)
      return toast.error('Nismo uspjeli potvrditi narudžbu', {
        style: {
          backgroundColor: 'var(--white)',
          color: 'var(--black)',
          fontSize: '1.4rem',
        },
      });

    setLiveOrders((live) => {
      const [order] = live.orders.splice(orderIndex, 1);
      order.orderStatus = OrderStatus.CONFIRMED;
      setPreviousOrders((prev) => ({
        orders: [order, ...prev.orders],
        hasMore: prev.hasMore,
      }));
      console.log('lajv', live);
      return { ...live };
    });
  };

  const cancelOrder = async (id: string) => {
    const orderIndex = liveOrders.orders.findIndex((order) => order._id === id);
    if (orderIndex === -1) return;

    const confirmResposne = await fetch(`${getOrdersUrl}/reject/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    console.log(confirmResposne.ok);
    if (!confirmResposne.ok)
      return toast.error('Nismo uspjeli odbiti narudžbu', {
        style: {
          backgroundColor: 'var(--white)',
          color: 'var(--black)',
          fontSize: '1.4rem',
        },
      });

    setLiveOrders((prev) => {
      prev.orders.splice(orderIndex, 1);
      console.log('PREV', prev);
      return { ...prev };
    });
  };

  const loadMoreOrders = async (type: 'unconfirmed' | 'confirmed') => {
    const setFunction =
      type === 'confirmed' ? setPreviousOrders : setLiveOrders;
    const orders = type === 'confirmed' ? previousOrders : liveOrders;

    const loadOrdersResponse = await fetch(
      `${getOrdersUrl}/${type}?skip=${orders.orders.length}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!loadOrdersResponse.ok)
      return toast.error('Nismo uspjeli učitati više narudžbi', {
        style: {
          backgroundColor: 'var(--white)',
          color: 'var(--black)',
          fontSize: '1.4rem',
        },
      });

    const { response } = (await loadOrdersResponse.json()) as {
      response: OrdersState;
    };

    setFunction((prev) => ({
      orders: prev.orders.concat(response.orders),
      hasMore: response.hasMore,
    }));
  };

  const socketRef = useRef<Socket>();

  useEffect(() => {
    console.log('mounted');
    if (!socketRef.current) socketRef.current = io(URL);
    if (socketRef.current) {
      socketRef.current.emit('join', '77');
    }

    return () => {
      console.log('unmounted');
      if (socketRef.current) {
        socketRef.current.off();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current)
      socketRef.current.on('newOrder', (order: OrderItemType) => {
        console.log('recieved order');
        setLiveOrders((prev) => ({
          orders: [order, ...prev.orders],
          hasMore: prev.hasMore,
        }));
      });
  }, [socketRef]);

  useEffect(() => {
    console.log('sent');
    doFetch({ method: 'GET', credentials: 'include' });
  }, [doFetch]);

  useEffect(() => {
    if (!ordersState.data) return;
    console.log(ordersState.data);
    setLiveOrders((prev) => ({
      orders: prev.orders.concat(ordersState.data!.liveOrders.orders),
      hasMore: ordersState.data!.liveOrders.hasMore,
    }));
    setPreviousOrders((prev) => ({
      orders: prev.orders.concat(ordersState.data!.previousOrders.orders),
      hasMore: ordersState.data!.previousOrders.hasMore,
    }));
  }, [ordersState.data]);

  console.log(liveOrders, previousOrders);

  if (ordersState.error)
    return (
      <ErrorSection
        handleFormReload={() =>
          doFetch({ method: 'GET', credentials: 'include' })
        }
      />
    );
  if (ordersState.isLoading) return <LoadingSection />;
  if (ordersState.data)
    return (
      <div className={styles.contentBox}>
        <ToastContainer
          autoClose={2500}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          limit={2}
        />
        <div className={styles.liveContent}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>Narudžbe uživo</h2>
            <div className={styles.liveIcon} />
          </div>
          {liveOrders.orders.length === 0 ? (
            <p className={styles.noOrders}>Nemate novih nardužbi</p>
          ) : (
            <>
              <TransitionGroup className={styles.ordersGrid}>
                {liveOrders.orders.map((order) => (
                  <CSSTransition
                    key={order._id}
                    timeout={500}
                    classNames={{
                      enter: styles.orderItemEnter,
                      enterActive: styles.orderItemEnterActive,
                      enterDone: styles.orderItemEnterDone,
                      exitActive: styles.orderItemExitActive,
                      exitDone: styles.orderItemExit,
                    }}
                  >
                    <OrderItem
                      order={order}
                      confirmOrder={confirmOrder}
                      cancelOrder={cancelOrder}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {liveOrders.hasMore && (
                <div className={styles.loadMoreBox}>
                  <button className={styles.loadMoreBtn}>Učitaj više...</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>Prijašnje narudžbe</h2>
        </div>
        {previousOrders.orders.length === 0 ? (
          <p className={styles.noOrders}>Nemate novih nardužbi</p>
        ) : (
          <>
            <TransitionGroup className={styles.ordersGrid}>
              {previousOrders.orders.map((order) => (
                <CSSTransition
                  key={order._id}
                  timeout={500}
                  classNames={{
                    enter: styles.orderItemEnter,
                    enterActive: styles.orderItemEnterActive,
                    enterDone: styles.orderItemEnterDone,
                    exitActive: styles.orderItemExitActive,
                    exitDone: styles.orderItemExit,
                  }}
                >
                  <OrderItem
                    order={order}
                    confirmOrder={confirmOrder}
                    cancelOrder={cancelOrder}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
            {previousOrders.hasMore && (
              <div className={styles.loadMoreBox}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => loadMoreOrders('confirmed')}
                >
                  Učitaj više...
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );

  return <LoadingSection />;
};

export default Orders;
