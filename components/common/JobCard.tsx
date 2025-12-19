import { ServiceRecord } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface JobCardProps {
  job: ServiceRecord;
  displayContactName?: string;
  onPress?: () => void;
  onAcceptPress?: () => void;
  onRejectPress?: () => void;
  onCompletePress?: () => void;
  onCallCustomerPress?: () => void;
  onMessageCustomerPress?: () => void;
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  style?: ViewStyle;
  progress?: number; // 0-100 for in_progress jobs
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onAcceptPress,
  onRejectPress,
  onCompletePress,
  onCallCustomerPress,
  onMessageCustomerPress,
  variant = "default",
  showActions = true,
  style,
  progress = 0,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 16,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };

    if (variant === "compact") {
      baseStyle.marginVertical = 4;
      baseStyle.marginHorizontal = 8;
    }

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: "#FFFFFF",
      padding: variant === "compact" ? 12 : 16,
    };

    return baseStyle;
  };

  const getStatusColor = (status: ServiceRecord["status"]): string => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "accepted":
        return "#007AFF";
      case "in_progress":
        return "#34C759";
      case "completed":
        return "#28A745";
      case "rejected":
      case "cancelled":
        return "#DC3545";
      default:
        return "#6C757D";
    }
  };

  const getStatusText = (status: ServiceRecord["status"]): string => {
    switch (status) {
      case "pending":
        return "Bekliyor";
      case "accepted":
        return "Kabul Edildi";
      case "in_progress":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      case "rejected":
        return "Reddedildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = () => (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusColor(job.status) + "20" },
      ]}
    >
      <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
        {getStatusText(job.status)}
      </Text>
    </View>
  );

  const renderCustomerInfo = () => {
    if (variant === "compact") return null;

    return (
      <View style={styles.customerContainer}>
        <View style={styles.customerRow}>
          <Ionicons name="person" size={16} color="#6C757D" />
          <Text style={styles.customerText}>
            {job.mechanicName || "Müşteri Bilgisi Yok"}
          </Text>
        </View>

        <View style={styles.customerRow}>
          <Ionicons name="calendar" size={16} color="#6C757D" />
          <Text style={styles.customerText}>{formatDate(job.date)}</Text>
        </View>
      </View>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;

    if (job.status === "pending") {
      return (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onRejectPress}
          >
            <Text style={[styles.actionButtonText, styles.rejectButtonText]}>
              Reddet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAcceptPress}
          >
            <Text style={styles.actionButtonText}>Kabul Et</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (job.status === "accepted") {
      return (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={onCallCustomerPress}
          >
            <Ionicons name="call" size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={onMessageCustomerPress}
          >
            <Ionicons name="chatbubble" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      );
    }

    if (job.status === "in_progress") {
      return (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={onCompletePress}
          >
            <Text style={styles.actionButtonText}>Tamamla</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={getContentStyle()}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title}
          </Text>
          {renderStatusBadge()}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>

        {renderCustomerInfo()}

        <View style={styles.footer}>
          <Text style={styles.price}>{job.cost} ₺</Text>
        </View>

        {renderActions()}
      </View>

      {job.status === "in_progress" && progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 12,
    lineHeight: 20,
  },
  customerContainer: {
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  customerText: {
    fontSize: 13,
    color: "#495057",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#DEE2E6",
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  rejectButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DC3545",
  },
  rejectButtonText: {
    color: "#DC3545",
  },
  acceptButton: {
    backgroundColor: "#007AFF",
  },
  callButton: {
    backgroundColor: "#28A745",
    flex: 0.5,
  },
  messageButton: {
    backgroundColor: "#FF9500",
    flex: 0.5,
  },
  completeButton: {
    backgroundColor: "#28A745",
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#E9ECEF",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#34C759",
  },
});

export default JobCard;
