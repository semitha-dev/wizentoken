"use client"

export default function StakePanel() {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="text-lg font-semibold mb-2">Stake WZN</h2>

      <form className="space-y-3">
        <input
          type="number"
          placeholder="Amount to stake"
          className="w-full px-4 py-2 border rounded-md"
        />
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Stake
          </button>
          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Claim Rewards
          </button>
        </div>
      </form>
    </div>
  )
}
