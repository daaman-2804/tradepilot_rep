"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore"

type ClientAnalyticsProps = {
  clientId: string | null
  userId: string | null
}

// Define the expected type for user data
type UserData = {
  // Define the properties you expect in the user data
  name: string;
  email: string;
  // Add other properties as needed
}

// Define the expected type for invoices
type Invoice = {
  id: string;
  amount: string | number; // Allow both string and number
  buyerName: string;
  date: string; // Ensure this is a string in the correct format
}

export function ClientAnalytics({ clientId, userId }: ClientAnalyticsProps) {
  const [userData, setUserData] = useState<UserData | null>(null); // Use the defined type
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]) // Use the defined Invoice type
  const [totalSpent, setTotalSpent] = useState(0)
  const [invoiceCount, setInvoiceCount] = useState(0)

  useEffect(() => {
    const fetchClientInvoices = async () => {
      if (!clientId || !userId) return;

      const db = getFirestore();
      const invoicesCollection = collection(db, "users", userId, "invoices");
      const invoicesQuery = query(invoicesCollection, where("buyerName", "==", clientId.trim()));
      const invoicesSnapshot = await getDocs(invoicesQuery);

      const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[];

      console.log("Client ID:", clientId); // Log the client ID
      console.log("Fetched Invoices for Client:", invoices); // Log the fetched invoices

      // Check if invoices are empty
      if (invoices.length === 0) {
        console.warn(`No invoices found for client: ${clientId}`);
      }

      setClientInvoices(invoices);

      // Calculate total spent and invoice count
      const total = invoices.reduce((sum, invoice) => {
        // Check if amount is a string and parse it
        const amount = typeof invoice.amount === 'number' 
          ? invoice.amount 
          : parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""));

        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      setTotalSpent(total);
      setInvoiceCount(invoices.length);
    };

    fetchClientInvoices();
  }, [clientId, userId]);

  const [spendingData, setSpendingData] = useState({
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Monthly Spending",
        data: Array(12).fill(0), // Initialize for all 12 months
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  })

  const [categoryData, setCategoryData] = useState({
    labels: ["Products", "Services", "Subscriptions", "Support", "Other"],
    datasets: [
      {
        label: "Spending by Category",
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  })

  const [shipmentData, setShipmentData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Shipment Timeline",
        data: [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  })

  useEffect(() => {
    if (clientInvoices.length > 0) {
      const monthlySpending = Array(12).fill(0);

      clientInvoices.forEach((invoice) => {
        const date = new Date(invoice.date);
        const month = date.getMonth(); // 0-11 for Jan-Dec
        const amount = typeof invoice.amount === 'number' 
          ? invoice.amount 
          : parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(month) && !isNaN(amount)) {
          monthlySpending[month] += amount;
        }
      });

      setSpendingData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: monthlySpending,
        }],
      }));

      console.log("Monthly Spending Data:", monthlySpending);

      // Generate category data (this can be customized based on your needs)
      const categories = ["Products", "Services", "Subscriptions", "Support", "Other"];
      const categorySpending = categories.map(() => Math.floor(Math.random() * 5000) + 1000);

      setCategoryData({
        labels: categories,
        datasets: [
          {
            label: "Spending by Category",
            data: categorySpending,
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [clientInvoices]);

  if (!clientId) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-white/70">Select a client to view analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Client Spending History</CardTitle>
          <CardDescription className="text-white/70">Monthly spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={spendingData}
            className="aspect-[2/1]"
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
                x: {
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Spending by Category</CardTitle>
          <CardDescription className="text-white/70">Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <PieChart
            data={categoryData}
            className="aspect-square"
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Shipment Timeline</CardTitle>
          <CardDescription className="text-white/70">Weekly shipment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={shipmentData}
            className="aspect-[2/1]"
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
                x: {
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Total Invoices</CardTitle>
          <CardDescription className="text-white/70">Total number of invoices for this client</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-white">{invoiceCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Total Spent</CardTitle>
          <CardDescription className="text-white/70">Total amount spent by this client</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-white">${totalSpent.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

