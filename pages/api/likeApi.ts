import type { NextApiRequest,NextApiResponse } from "next"

const likeApi = async (req:NextApiRequest, res:NextApiResponse) => {
  try {
    console.log('like api call!!');

    // TODO
    // セッション情報の取得
    // blueskyログイン
    // ポストにいいねを送信する

    return res.status(200).json({ message:"成功" });
  } catch (error) {
    return res.status(400).json({ message:"失敗" });
  }
};

export default likeApi;