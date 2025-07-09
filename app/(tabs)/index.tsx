import { RevenueChart } from "@/components/RevenueChart";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
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
            <View style={[styles.featureCard, { backgroundColor: "#FFFFFF" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "rgba(0, 122, 255, 0.1)" },
                ]}
              >
                <IconSymbol name="camera.fill" size={24} color="#3864bb" />
              </View>
              <ThemedText style={styles.featureTitle}>Scan Items</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Use the camera to quickly scan items while browsing stores
              </ThemedText>
            </View>

            <View style={[styles.featureCard, { backgroundColor: "#FFFFFF" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "rgba(52, 199, 89, 0.1)" },
                ]}
              >
                <IconSymbol
                  name="dollarsign.circle.fill"
                  size={24}
                  color="#34C759"
                />
              </View>
              <ThemedText style={styles.featureTitle}>Get Estimates</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Receive instant AI-powered price estimates and market data
              </ThemedText>
            </View>

            <View style={[styles.featureCard, { backgroundColor: "#FFFFFF" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "rgba(255, 149, 0, 0.1)" },
                ]}
              >
                <IconSymbol
                  name="chart.line.uptrend.xyaxis"
                  size={24}
                  color="#FF9500"
                />
              </View>
              <ThemedText style={styles.featureTitle}>Track Profits</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Monitor your purchases, sales, and profits all in one place
              </ThemedText>
            </View>

            <View style={[styles.featureCard, { backgroundColor: "#FFFFFF" }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: "rgba(255, 59, 48, 0.1)" },
                ]}
              >
                <IconSymbol name="bolt.fill" size={24} color="#FF3B30" />
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
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: "#3864bb",
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#45c2c6",
    overflow: "hidden",
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#45c2c6",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  contentSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  comingSoonSection: {
    marginTop: 20,
  },
  comingSoonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(175, 82, 222, 0.1)",
  },
  comingSoonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(175, 82, 222, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
  },
});
