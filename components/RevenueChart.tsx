import { useStore } from '@/store';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ThemedText } from './ThemedText';

const screenWidth = Dimensions.get('window').width;

export function RevenueChart() {
  const { items } = useStore();

  const chartData = useMemo(() => {
    // Get last 6 months of data
    const now = new Date();
    const months = [];
    const revenueData = [];
    const profitData = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthLabel);
      
      // Calculate revenue and profit for this month
      let monthRevenue = 0;
      let monthProfit = 0;
      
      items.forEach(item => {
        if (item.sold && item.priceSold) {
          const itemDate = new Date(item.timestamp);
          const itemMonthKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
          
          if (itemMonthKey === monthKey) {
            monthRevenue += item.priceSold;
            if (item.purchased && item.pricePaid) {
              monthProfit += (item.priceSold - item.pricePaid);
            }
          }
        }
      });
      
      revenueData.push(monthRevenue);
      profitData.push(monthProfit);
    }
    
    return {
      labels: months,
      datasets: [
        {
          data: revenueData,
          color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`, // Green for revenue
          strokeWidth: 3,
        },
        {
          data: profitData,
          color: (opacity = 1) => `rgba(56, 100, 187, ${opacity})`, // Blue for profit
          strokeWidth: 3,
        },
      ],
    };
  }, [items]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    let totalRevenue = 0;
    let totalProfit = 0;
    
    items.forEach(item => {
      if (item.sold && item.priceSold) {
        totalRevenue += item.priceSold;
        if (item.purchased && item.pricePaid) {
          totalProfit += (item.priceSold - item.pricePaid);
        }
      }
    });
    
    return { totalRevenue, totalProfit };
  }, [items]);

  const hasData = chartData.datasets[0].data.some(value => value > 0) || 
                  chartData.datasets[1].data.some(value => value > 0);

  if (!hasData) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Revenue & Profit</ThemedText>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No sales data yet. Start selling items to see your revenue and profit trends!
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Revenue & Profit</ThemedText>
        <View style={styles.totalsRow}>
          <View style={styles.totalItem}>
            <ThemedText style={styles.totalLabel}>Total Revenue</ThemedText>
            <ThemedText style={[styles.totalValue, { color: '#34C759' }]}>
              ${totals.totalRevenue.toFixed(2)}
            </ThemedText>
          </View>
          <View style={styles.totalItem}>
            <ThemedText style={styles.totalLabel}>Total Profit</ThemedText>
            <ThemedText style={[styles.totalValue, { color: '#3864bb' }]}>
              ${totals.totalProfit.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#FFFFFF',
          },
          propsForBackgroundLines: {
            strokeDasharray: '', // solid lines
            stroke: '#F0F0F0',
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        formatYLabel={(value) => `$${value}`}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
          <ThemedText style={styles.legendText}>Revenue</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3864bb' }]} />
          <ThemedText style={styles.legendText}>Profit</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});