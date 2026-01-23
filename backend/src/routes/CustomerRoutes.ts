import { Router } from "express";
import { CustomerService } from "../services/CustomerService";

const router = Router();

// SSE clients tracking
const sseClients: Set<any> = new Set();

/**
 * GET /api/customers/sse/stream
 */
router.get("/sse/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Accel-Buffering", "no");

  sseClients.add(res);

  const customers = await CustomerService.getAllCustomers();

  res.write(`event: customer-update\n`);
  res.write(`data: ${JSON.stringify({ type: "initial", customers })}\n\n`);

  req.on("close", () => {
    sseClients.delete(res);
    res.end();
  });
});

/** GET /api/customers*/
router.get("/", async (_req, res) => {
  const customers = await CustomerService.getAllCustomers();
  res.json(customers);
});

/**
 * GET /api/customers/:id
 */
router.get("/:id", async (req, res) => {
  const customer = await CustomerService.getCustomerById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json(customer);
});

/** POST /api/customers*/
router.post("/", async (req, res) => {
  try {
    const newCustomer = await CustomerService.addCustomer(req.body);

    broadcastCustomerUpdate("add", newCustomer);

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error });
  }
});

/** PUT /api/customers/:id*/
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await CustomerService.updateCustomer(
      req.params.id,
      req.body
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    broadcastCustomerUpdate("update", updatedCustomer);

    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error updating customer", error });
  }
});

/**
 * DELETE /api/customers/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CustomerService.deleteCustomer(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    broadcastCustomerUpdate("delete", { id: req.params.id });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting customer", error });
  }
});

/**
 * PATCH /api/customers/:id/suspend */
router.patch("/:id/suspend", async (req, res) => {
  try {
    const suspendedCustomer = await CustomerService.suspendCustomer(
      req.params.id
    );

    if (!suspendedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    broadcastCustomerUpdate("suspend", suspendedCustomer);

    res.json(suspendedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error suspending customer", error });
  }
}); 

/**
 * ✅ Toggle status
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedCustomer =
      await CustomerService.updateCustomerStatus(req.params.id, status);

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    broadcastCustomerUpdate("update", updatedCustomer);

    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Error updating status", error });
  }
});


// 🔁 SSE broadcaster
function broadcastCustomerUpdate(
  type: "add" | "update" | "delete" | "suspend",
  data: any
) {
  const payload = JSON.stringify({
    type,
    data,
    timestamp: new Date().toISOString()
  });

  sseClients.forEach(client => {
    client.write(`event: customer-update\n`);
    client.write(`data: ${payload}\n\n`);
  });
}

export default router;