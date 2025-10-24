import { notification } from "antd";

// thông báo 
export const openNotification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    placement: "topRight",
  });
};