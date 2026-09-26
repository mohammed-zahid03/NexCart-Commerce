import React, { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../api/api";

const NotificationBell = () => {
  const { user } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);

 
 const fetchNotifications = async () => {
  try {
    const { data } = await api.get("/notifications");

    setNotifications(data);
  } catch (error) {
    console.error("Notification fetch error:", error);
    setNotifications([]);
  }
};

 const fetchUnreadCount = async () => {
  try {
    const { data } = await api.get("/notifications/unread-count");

    setUnreadCount(Number(data || 0));
  } catch (error) {
    console.error("Unread notification count error:", error);
    setUnreadCount(0);
  }
};


  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchNotifications();
    fetchUnreadCount();
  }, [user?.id]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

 const handleMarkAsRead = async (notificationId) => {
  try {
    await api.put(
      `/notifications/${notificationId}/read`
    );

    setNotifications((current) =>
      current.map((notification) =>
        notification.notificationId === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    setUnreadCount((current) =>
      Math.max(current - 1, 0)
    );
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );
  }
};

  if (!user?.id) {
    return null;
  }

  return (
   <div ref={notificationRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex items-center justify-center text-gray-700 transition hover:text-black"
        aria-label="Notifications"
      >
        <Bell size={21} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Notifications
              </h3>

              <p className="text-xs text-gray-500">
                {unreadCount} unread
              </p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`border-b border-gray-100 px-4 py-3 ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <Bell size={15} className="text-slate-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        {notification.message}
                      </p>

                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification.notificationId
                            )
                          }
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          <Check size={13} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;