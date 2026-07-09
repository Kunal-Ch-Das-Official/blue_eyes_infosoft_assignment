import jwt from "jsonwebtoken";
import envConfig from "../../config/envConfig";

const cookiePayload = (payload: any) => {
  const token = jwt.sign(payload, envConfig.jwt_secret, { expiresIn: "3d" });
  jwt.verify(token, envConfig.jwt_secret, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message);
    } else {
      console.log("Decoded payload:", decoded);
    }
  });
};

export default cookiePayload;
