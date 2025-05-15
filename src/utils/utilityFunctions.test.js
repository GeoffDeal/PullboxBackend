import { afterEach, beforeEach, describe, expect, jest } from "@jest/globals";

const mockPoolEnd = jest.fn();
const mockPoolExecute = jest.fn();

jest.unstable_mockModule("../dbConfig.js", () => ({
  pool: {
    end: mockPoolEnd,
    execute: mockPoolExecute,
  },
}));

const mockExit = jest.fn();
const mockLog = jest.fn();
const mockError = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();

  jest.spyOn(console, "log").mockImplementation(mockLog);
  jest.spyOn(console, "error").mockImplementation(mockError);
  jest.spyOn(process, "exit").mockImplementation(mockExit);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  mockPoolEnd.mockReset();
  mockPoolExecute.mockReset();
});

describe("closePool", () => {
  it("closes pool and exits process", async () => {
    const { closePool } = await import("./utilityFunctions.js");

    mockPoolEnd.mockResolvedValueOnce();

    await closePool("SIGINT");

    expect(mockLog).toHaveBeenCalledWith("Received signal: SIGINT");
    expect(mockPoolEnd).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith("Pool Closed");

    jest.advanceTimersByTime(1000);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("logs an error if pool.end fails", async () => {
    const { closePool } = await import("./utilityFunctions.js");

    const error = new Error("Connection error");
    mockPoolEnd.mockRejectedValueOnce(error);

    await closePool("SIGTERM");

    expect(mockLog).toHaveBeenCalledWith("Received signal: SIGTERM");
    expect(mockError).toHaveBeenCalledWith("Error closing pool: ", error);

    jest.advanceTimersByTime(1000);
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});

describe("checkTables", () => {
  it("checks for tables 8 times and logs success", async () => {
    const { tableCheck } = await import("./utilityFunctions.js");

    mockPoolExecute.mockResolvedValue();

    await tableCheck();

    expect(mockLog).toHaveBeenCalledWith("Checking tables...");
    expect(mockPoolExecute).toHaveBeenCalledTimes(7);
    expect(mockLog).toHaveBeenCalledWith("Check complete");
    expect(mockError).not.toHaveBeenCalled();
  });

  it("logs an error if pool.execute throws", async () => {
    const { tableCheck } = await import("./utilityFunctions.js");

    const error = new Error("Execution error");
    mockPoolExecute.mockRejectedValueOnce(error);

    await tableCheck();

    expect(mockError).toHaveBeenLastCalledWith(
      "Problem checking tables: ",
      error
    );
  });
});
