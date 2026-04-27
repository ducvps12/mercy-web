import cron from 'node-cron';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { ACB_CRON_SCHEDULE, ACB_HISTORY_API_URL, ENABLE_ACB_CRON } from '../config';

const prisma = new PrismaClient();

export const startAcbCronJob = () => {
  if (!ENABLE_ACB_CRON) {
    console.log('ACB cron job is disabled by ENABLE_ACB_CRON=false');
    return;
  }

  // Run every 2 minutes
  cron.schedule(ACB_CRON_SCHEDULE, async () => {
    try {
      if (!ACB_HISTORY_API_URL) {
        console.error('Missing ACB_HISTORY_API_URL');
        return;
      }

      console.log('Running ACB Payment verification job...');
      const response = await axios.get(ACB_HISTORY_API_URL);
      
      if (response.data && response.data.codeStatus === 200) {
        const transactions = response.data.data || [];
        
        // Find all pending orders
        const pendingOrders = await prisma.orders.findMany({
          where: { status: 'pending' }
        });
        
        for (const order of pendingOrders) {
          // Look for a transaction that matches the orderCode (e.g. MERCY-123) and amount
          const cleanOrderId = String(order.order_code).toLowerCase().replace(/[^a-z0-9]/g, '');
          const matchedTx = transactions.find((tx: any) => {
            const cleanDesc = String(tx.description).toLowerCase().replace(/[^a-z0-9]/g, '');
            return tx.type === 'IN' && // We check IN transactions
                   tx.amount >= Number(order.total) &&
                   cleanDesc.includes(cleanOrderId);
          });
          
          if (matchedTx) {
            console.log(`Order ${order.order_code} has been paid! tx:`, matchedTx.description);
            // Update order status to confirmed
            await prisma.orders.update({
              where: { id: order.id },
              data: { 
                status: 'confirmed'
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
