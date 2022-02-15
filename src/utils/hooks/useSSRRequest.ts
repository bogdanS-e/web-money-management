import { IUserTokens } from "@/api/models/user";
import Cookies from "cookies";

const useSSRRequest = async (req, res, url: string): Promise<Response> => {
  const cookies = new Cookies(req, res);

  const access = cookies.get('access_token');
  const refresh = cookies.get('refresh_token');

  try {
    const resp = await fetch(`http://localhost:3000/api${url}`, {
      headers: {
        Authorization: `${access}`,
      }
    });

    if (resp.status === 401) {
      const refreshResp = await fetch(`http://localhost:3000/api/auth/refresh-token/?token=${refresh}`);
      
      if (refreshResp.status === 200) {
        const refreshJson: IUserTokens = await refreshResp.json();

        cookies.set('access_token', refreshJson.accessToken, {httpOnly: false});
        cookies.set('refresh_token', refreshJson.refreshToken, {httpOnly: false});

        return await fetch(`http://localhost:3000/api${url}`, {
          headers: {
            Authorization: `${refreshJson.accessToken}`,
          }
        });
      } else if (refreshResp.status === 401) {
        res.setHeader('location', '/sign-in');
        res.statusCode = 302;
        res.end();
      }
    }

    return resp;
  } catch (error) {
    console.log(error);
    return error
  }
}

export default useSSRRequest;