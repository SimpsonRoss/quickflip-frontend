import { RevenueChart } from "@/components/RevenueChart";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/companyLogoCircle.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <ThemedText type="title" style={styles.heroTitle}>
              QuickFlip
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Scan, Buy, Sell, Profit
            </ThemedText>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.contentSection}>
          <RevenueChart />
        </View>

        {/* Feature Cards */}
        <View style={styles.contentSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How it works
          </ThemedText>

          <View style={styles.featureGrid}>
            <View
              style={[styles.featureCard, { backgroundColor: Colors.surface }]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: Colors.purchased.background },
                ]}
              >
                <IconSymbol
                  name="camera.fill"
                  size={24}
                  color={Colors.purchased.main}
                />
              </View>
              <ThemedText style={styles.featureTitle}>Scan Items</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Use the camera to quickly scan items while browsing stores
              </ThemedText>
            </View>

            <View
              style={[styles.featureCard, { backgroundColor: Colors.surface }]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: Colors.sold.background },
                ]}
              >
                <IconSymbol
                  name="dollarsign.circle.fill"
                  size={24}
                  color={Colors.sold.main}
                />
              </View>
              <ThemedText style={styles.featureTitle}>Get Estimates</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Receive instant AI-powered price estimates and market data
              </ThemedText>
            </View>

            <View
              style={[styles.featureCard, { backgroundColor: Colors.surface }]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: Colors.scanned.background },
                ]}
              >
                <IconSymbol
                  name="chart.line.uptrend.xyaxis"
                  size={24}
                  color={Colors.scanned.main}
                />
              </View>
              <ThemedText style={styles.featureTitle}>Track Profits</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Monitor your purchases, sales, and profits all in one place
              </ThemedText>
            </View>

            <View
              style={[styles.featureCard, { backgroundColor: Colors.surface }]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: Colors.error + "1A" },
                ]}
              >
                <IconSymbol name="bolt.fill" size={24} color={Colors.error} />
              </View>
              <ThemedText style={styles.featureTitle}>Export Data</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Export your inventory data for taxes and accounting
              </ThemedText>
            </View>
          </View>

          {/* Coming Soon Section */}
          <View style={styles.comingSoonSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              What&apos;s coming next?
            </ThemedText>

            <View style={styles.comingSoonCard}>
              <View style={styles.comingSoonIconContainer}>
                <IconSymbol name="sparkles" size={32} color="#AF52DE" />
              </View>
              <View style={styles.comingSoonContent}>
                <ThemedText style={styles.comingSoonTitle}>
                  AI-Powered Features
                </ThemedText>
                <ThemedText style={styles.comingSoonDescription}>
                  • Smart item descriptions{"\n"}• Dynamic pricing suggestions
                  {"\n"}• Automatic inventory export{"\n"}• Profit optimization
                  insights
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xxxl,
    paddingBottom: 60,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xxl + 8,
    borderBottomRightRadius: BorderRadius.xxl + 8,
  },
  heroContent: {
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.base,
    borderWidth: 2,
    borderColor: "#45c2c6",
    overflow: "hidden",
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: 36,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#45c2c6",
    fontSize: Typography.body.fontSize,
    fontWeight: "500",
    textAlign: "center",
  },
  contentSection: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.base,
    marginBottom: Spacing.lg,
  },
  featureCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  featureIconContainer: {
    width: Spacing.huge,
    height: Spacing.huge,
    borderRadius: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  featureTitle: {
    ...Typography.bodySemiBold,
    marginBottom: Spacing.xs / 2,
  },
  featureDescription: {
    ...Typography.caption,
    lineHeight: 20,
  },
  comingSoonSection: {
    marginTop: Spacing.lg,
  },
  comingSoonCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "flex-start",
    ...Shadows.large,
    borderWidth: 1,
    borderColor: "rgba(175, 82, 222, 0.1)",
  },
  comingSoonIconContainer: {
    width: Spacing.massive,
    height: Spacing.massive,
    borderRadius: Spacing.xxl,
    backgroundColor: "rgba(175, 82, 222, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.base,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    ...Typography.bodySemiBold,
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  comingSoonDescription: {
    ...Typography.caption,
    fontSize: 15,
    lineHeight: 22,
  },
});
