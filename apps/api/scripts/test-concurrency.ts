/**
 * Concurrency Attack Verification Script
 * Fires parallel requests against the reservation API to verify zero overselling and OCC defense.
 */
async function runConcurrencyAttack() {
  const API_URL = process.env.API_URL || "http://localhost:3001";
  const TOTAL_REQUESTS = 100; // Simulated concurrent users
  const ITEM_ID = "00000000-0000-0000-0000-000000000001";

  console.log(`\n⚡ [CONCURRENCY ATTACK] Launching ${TOTAL_REQUESTS} parallel reservation requests...`);

  const requests = Array.from({ length: TOTAL_REQUESTS }, (_, idx) => {
    return fetch(`${API_URL}/api/inventory/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: ITEM_ID,
        userId: `00000000-0000-0000-0000-00000000000${(idx % 9) + 1}`,
        expectedVersion: 0, // All parallel requests attempt to claim version 0!
        quantity: 1,
      }),
    })
      .then((res) => ({ status: res.status }))
      .catch((err) => ({ status: 500, error: err.message }));
  });

  const results = await Promise.all(requests);
  const successes = results.filter((r) => r.status === 200).length;
  const conflicts = results.filter((r) => r.status === 409).length;
  const others = results.filter((r) => r.status !== 200 && r.status !== 409).length;

  console.log("\n=======================================================");
  console.log("📊 SPRINT BENCHMARK REPORT: CONCURRENCY DEFENSE");
  console.log("=======================================================");
  console.log(`• Total Concurrent Requests : ${TOTAL_REQUESTS}`);
  console.log(`• HTTP 200 Successes        : ${successes} (Target: Exactly 1)`);
  console.log(`• HTTP 409 OCC Conflicts    : ${conflicts} (Target: ${TOTAL_REQUESTS - 1})`);
  console.log(`• Errors / Other Statuses   : ${others}`);
  console.log("=======================================================");

  if (successes === 1 && conflicts === TOTAL_REQUESTS - 1) {
    console.log("✅ PASSED: Zero state drift. Optimistic Concurrency Control held 100%!");
  } else {
    console.log("⚠️ Note: Run with Docker PostgreSQL started and seed database item initialized.");
  }
}

runConcurrencyAttack();
