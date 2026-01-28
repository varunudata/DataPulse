import { connectToDB } from "../services/schemaService.js";

export const connectControler = async (req, res) => {
  try {
    const dbConnection = await connectToDB(req.body);
    if (!dbConnection) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid database credentials" });
    }
    return res.status(200).json({
      success: true,
      message: "Data base connected successfully",
      data: dbConnection,
    });
  } catch (error) {
    console.log("Error in connecting to database ", error);
    // Identify common connection errors to return 400 instead of 500
    const isConnectionError =
      error.code === 'ECONNREFUSED' ||
      error.code === 'ER_ACCESS_DENIED_ERROR' ||
      error.code === 'ER_BAD_DB_ERROR' ||
      error.code === 'PROTOCOL_CONNECTION_LOST';

    return res.status(isConnectionError ? 400 : 500).json({
      success: false,
      message: error.message || "Internal Server Error while connecting to database",
    });
  }
};
