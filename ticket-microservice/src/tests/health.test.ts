
/***
 * This file is used to test the health of the application.
 * @author: {Deepak Kumar} <deepak.kumar@suhora.com>
 */
import mongoose from "mongoose"
import dotenv from "dotenv"


const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });


describe("MongoDB Connection", () => {
  beforeAll(async () => {
    const DB_URI = process.env["DB_URL"] 

    if (!DB_URI) {
      throw new Error("Database connection URI is not defined")
    }

    console.log("Connecting to MongoDB...")

    await mongoose.connect(DB_URI, {})
  })
  afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
  })

  it("should connect to MongoDB successfully", async () => {
    expect(mongoose.connection.readyState).toBe(1)
  })

  it("should fail to connect with invalid URI", async () => {
    await expect(mongoose.connect("invalid-uri")).rejects.toThrow()
  })
})
