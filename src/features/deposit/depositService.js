const STORAGE_KEY = "digigold_demo_deposits";

// Read all deposits from localStorage
const readDeposits = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const deposits = JSON.parse(storedData);

    return Array.isArray(deposits) ? deposits : [];
  } catch (error) {
    console.error("Error reading deposits:", error);
    return [];
  }
};

// Save deposits to localStorage
const writeDeposits = (deposits) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deposits));
  } catch (error) {
    console.error("Error saving deposits:", error);
    throw new Error("Unable to save deposit. Please try again.");
  }
};

// Create a new deposit
export const createDeposit = async (payload) => {
  if (!payload) {
    throw new Error("Deposit details are required.");
  }

  const now = new Date().toISOString();

  const deposit = {
    id: `DEP-${Date.now().toString().slice(-8)}`,

    goldType: payload.goldType,
    purity: payload.purity,
    weight: Number(payload.weight),
    quantity: Number(payload.quantity),

    method: payload.method,
    branch: payload.branch,
    date: payload.date,
    time: payload.time,
    notes: payload.notes || "",

    status: "requested",
    createdAt: now,

    history: [
      {
        status: "requested",
        at: now,
      },
    ],

    verifiedPureGrams: null,
  };

  const deposits = readDeposits();

  writeDeposits([deposit, ...deposits]);

  return deposit;
};

// Get all deposits
export const getDeposits = async () => {
  return readDeposits();
};

// Get one deposit by ID
export const getDepositById = async (id) => {
  const deposits = readDeposits();

  return deposits.find((deposit) => deposit.id === id) || null;
};

// Update deposit status
export const updateDepositStatus = async (id, newStatus) => {
  const deposits = readDeposits();

  const depositExists = deposits.some((deposit) => deposit.id === id);

  if (!depositExists) {
    throw new Error("Deposit not found.");
  }

  const updatedDeposits = deposits.map((deposit) => {
    if (deposit.id !== id) {
      return deposit;
    }

    const now = new Date().toISOString();

    return {
      ...deposit,
      status: newStatus,
      history: [
        ...(deposit.history || []),
        {
          status: newStatus,
          at: now,
        },
      ],
    };
  });

  writeDeposits(updatedDeposits);

  return updatedDeposits.find((deposit) => deposit.id === id);
};

// Delete a deposit
export const deleteDeposit = async (id) => {
  const deposits = readDeposits();

  const updatedDeposits = deposits.filter((deposit) => deposit.id !== id);

  if (updatedDeposits.length === deposits.length) {
    throw new Error("Deposit not found.");
  }

  writeDeposits(updatedDeposits);

  return true;
};
