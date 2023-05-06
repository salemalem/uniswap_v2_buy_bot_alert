const telegramBot = "6144514413:AAEa7XdEytJ_DBc_h4CKlC2PeibVj3niPVY";
const telegramSendMessage = "https://api.telegram.org/bot" + telegramBot +"/sendMessage?chat_id=-1001873369004&parse_mode=Markdown&text=";


export async function telegramSendToGroup(message) {
  try {
    const result = await fetch(telegramSendMessage + message);
    return result;
  } catch (error) {
    console.error(error);
    return await telegramSendToGroup(message);
  }
}
