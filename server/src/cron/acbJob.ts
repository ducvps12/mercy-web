import cron from 'node-cron';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'https://api.sieuthicode.net/historyapiacb/ec4f8aeb9d87bc0ffa48f709365313d1';

export const startAcbCronJob = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      console.log('Running ACB Payment verification job...');
      const response = await axios.get(API_URL);
      
      if (response.data && response.data.messageStatus === 'success') {
        const transactions = response.data.data;
        
        // Find all pending orders
        const pendingOrders = await prisma.order.findMany({
          where: { status: 'pending' }
        });
        
        for (const order of pendingOrders) {
          // Look for a transaction that matches the orderCode (e.g. MERCY-123) and amount
          const matchedTx = transactions.find((tx: any) => 
            tx.type === 'IN' && // We check IN transactions, though API demo said OUT, typically user paying us is IN. If it's OUT, we'll check any just in case, but prefer looking at amount strictly.
            tx.amount === order.total &&
            tx.description.includes(order.orderCode)
          );
          
          if (matchedTx) {
            console.log(`Order ${order.orderCode} has been paid! tx:`, matchedTx.description);
            // Update order status to paid
            await prisma.order.update({
              where: { id: order.id },
              data: { 
                status: 'paid',
                bankVerified: true,
                paymentId: matchedTx.description // use desc or ref id as payment ID
              }
            });
            
            // If there's an affiliate code, we could theoretically allocate commission here
          }
        }
      }
    } catch (error) {
      console.error('Error in ACB cron job:', error);
    }
  });
};
