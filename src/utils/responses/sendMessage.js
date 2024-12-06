const sendMessage = (res, message) => {
  res.status(200).json({
    status: 'ok',
    message,
  });
};

export default sendMessage;
