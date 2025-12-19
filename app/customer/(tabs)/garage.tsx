import VehicleCard from "@/components/VehicleCard";
import Colors from "@/constants/Colors";
import {
  customers,
  cars as mockCars,
  reminders as mockReminders,
  serviceRecords,
} from "@/constants/mockData";
import { Car, Reminder, ServiceRecord } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useReducer, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ModalState = {
  addVehicle: boolean;
  detail: boolean;
  reminder: boolean;
};

type ModalAction =
  | { type: "openAdd" }
  | { type: "closeAdd" }
  | { type: "openDetail" }
  | { type: "closeDetail" }
  | { type: "openReminder" }
  | { type: "closeReminder" };

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "openAdd":
      return { ...state, addVehicle: true };
    case "closeAdd":
      return { ...state, addVehicle: false };
    case "openDetail":
      return { ...state, detail: true };
    case "closeDetail":
      return { ...state, detail: false };
    case "openReminder":
      return { ...state, reminder: true };
    case "closeReminder":
      return { ...state, reminder: false };
    default:
      return state;
  }
}

export default function GarageTab() {
  const currentUser = customers[0];
  const userCars = mockCars.filter((c) => c.ownerId === currentUser.id);
  const [cars, setCars] = useState<Car[]>(userCars);

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [state, dispatch] = useReducer(modalReducer, {
    addVehicle: false,
    detail: false,
    reminder: false,
  });

  const [detailTab, setDetailTab] = useState<"history" | "reminders">(
    "history"
  );
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");

  const [remindersByCar, setRemindersByCar] = useState<
    Record<string, Reminder[]>
  >(() => {
    const grouped: Record<string, Reminder[]> = {};
    mockReminders.forEach((r) => {
      if (!grouped[r.carId]) grouped[r.carId] = [];
      grouped[r.carId].push(r);
    });
    return grouped;
  });
  const [editingReminderId, setEditingReminderId] = useState<string | null>(
    null
  );
  const [remTitle, setRemTitle] = useState("");
  const [remDate, setRemDate] = useState("");
  const [remMileage, setRemMileage] = useState("");

  const resetVehicleForm = () => {
    setBrand("");
    setModel("");
    setYear("");
    setPlate("");
  };

  const resetReminderForm = () => {
    setEditingReminderId(null);
    setRemTitle("");
    setRemDate("");
    setRemMileage("");
  };

  const renderItem = ({ item }: { item: Car }) => (
    <VehicleCard
      car={item}
      onPress={() => {
        setSelectedCar(item);
        dispatch({ type: "openDetail" });
      }}
    />
  );

  const canSaveVehicle = useMemo(() => {
    return (
      brand.trim() !== "" &&
      model.trim() !== "" &&
      plate.trim() !== "" &&
      /^\d{4}$/.test(year.trim())
    );
  }, [brand, model, plate, year]);

  const saveVehicle = () => {
    if (!canSaveVehicle) return;
    const newCar: Car = {
      id: String(Date.now()),
      ownerId: currentUser.id,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year.trim()),
      plate: plate.trim(),
      color: "",
      image: undefined,
    };
    setCars((prev) => [newCar, ...prev]);
    dispatch({ type: "closeAdd" });
    resetVehicleForm();
  };

  const canSaveReminder = useMemo(
    () =>
      remTitle.trim().length > 0 &&
      (remDate.trim().length > 0 || remMileage.trim().length > 0),
    [remTitle, remDate, remMileage]
  );

  const saveReminder = () => {
    if (!selectedCar || !canSaveReminder) return;
    const carId = selectedCar.id;
    const entry: Reminder = {
      id: editingReminderId ?? String(Date.now()),
      carId,
      title: remTitle.trim(),
      dueDate: remDate.trim() || undefined,
      dueMileage: remMileage.trim() ? Number(remMileage.trim()) : undefined,
      isCompleted: false,
    };
    setRemindersByCar((prev) => {
      const list = prev[carId] || [];
      const updated = editingReminderId
        ? list.map((r) => (r.id === editingReminderId ? entry : r))
        : [entry, ...list];
      return { ...prev, [carId]: updated };
    });
    dispatch({ type: "closeReminder" });
    resetReminderForm();
  };

  const openEditReminder = (r: Reminder) => {
    setEditingReminderId(r.id);
    setRemTitle(r.title);
    setRemDate(r.dueDate ?? "");
    setRemMileage(r.dueMileage ? String(r.dueMileage) : "");
    dispatch({ type: "openReminder" });
  };

  const toggleReminderCompleted = (carId: string, reminderId: string) => {
    setRemindersByCar((prev) => {
      const list = prev[carId] || [];
      const updated = list.map((r) =>
        r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r
      );
      return { ...prev, [carId]: updated };
    });
  };

  const getStatusLabel = (status: ServiceRecord["status"]) => {
    switch (status) {
      case "pending":
        return "Bekleniyor";
      case "in_progress":
        return "Devam ediyor";
      case "completed":
        return "Tamamlandı";
      case "accepted":
        return "Kabul edildi";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: ServiceRecord["status"]) => {
    if (status === "completed") {
      return <Text style={{ color: Colors.light.success }}>✓</Text>;
    }
    if (status === "pending") {
      return <Text style={{ color: "#9E9E9E" }}>●</Text>;
    }
    if (status === "rejected") {
      return <Text style={{ color: "#FF0000" }}>●</Text>;
    }
    if (status === "in_progress" || status === "accepted") {
      return <Text style={{ color: "#2196F3" }}>●</Text>;
    }
    return null;
  };

  const jobsForSelected: ServiceRecord[] = useMemo(() => {
    if (!selectedCar) return [];
    return serviceRecords.filter((j) => j.carId === selectedCar.id);
  }, [selectedCar]);

  const remindersForSelected: Reminder[] = useMemo(() => {
    if (!selectedCar) return [];
    return remindersByCar[selectedCar.id] || [];
  }, [selectedCar, remindersByCar]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Araçlarım</Text>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => dispatch({ type: "openAdd" })}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={Colors.light.primary} />
        <Text style={styles.addButtonText}>Araç Ekle</Text>
      </TouchableOpacity>

      <Modal visible={state.addVehicle} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Araç</Text>
              <TouchableOpacity onPress={() => dispatch({ type: "closeAdd" })}>
                <Ionicons name="close" size={22} color={"#999"} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Marka</Text>
              <TextInput
                value={brand}
                onChangeText={setBrand}
                placeholder="Örn: Toyota"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Model</Text>
              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder="Örn: Corolla"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Yıl</Text>
                <TextInput
                  value={year}
                  onChangeText={setYear}
                  placeholder="Örn: 2022"
                  style={styles.input}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 2, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Plaka</Text>
                <TextInput
                  value={plate}
                  onChangeText={setPlate}
                  placeholder="Örn: 34 ABC 123"
                  style={styles.input}
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { opacity: canSaveVehicle ? 1 : 0.6 }]}
              onPress={saveVehicle}
              disabled={!canSaveVehicle}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={state.detail} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Araç Detayı</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => setDetailTab("history")}
                  style={{ marginRight: 12 }}
                >
                  <Ionicons
                    name={detailTab === "history" ? "list" : "list-outline"}
                    size={22}
                    color={Colors.light.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDetailTab("reminders")}
                  style={{ marginRight: 12 }}
                >
                  <Ionicons
                    name={detailTab === "reminders" ? "alarm" : "alarm-outline"}
                    size={22}
                    color={Colors.light.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch({ type: "closeDetail" })}
                >
                  <Ionicons name="close" size={22} color={"#999"} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={{ maxHeight: 600 }}>
              {selectedCar && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {selectedCar.brand} {selectedCar.model}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Plaka</Text>
                    <Text style={styles.value}>{selectedCar.plate}</Text>
                  </View>
                </View>
              )}

              {detailTab === "history" && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Geçmiş İşlemler</Text>
                  </View>
                  {jobsForSelected.length === 0 ? (
                    <Text style={styles.emptyText}>Kayıt bulunamadı</Text>
                  ) : (
                    jobsForSelected.map((job) => (
                      <View key={job.id} style={styles.jobItem}>
                        <View style={styles.jobRow}>
                          <Ionicons
                            name="build"
                            size={16}
                            color={Colors.light.primary}
                          />
                          <Text style={styles.jobTitle}>{job.title}</Text>
                        </View>
                        <Text style={styles.jobDesc}>
                          {job.description || ""}
                        </Text>
                        <View style={styles.jobMeta}>
                          <Text style={styles.jobMetaText}>
                            {job.date
                              ? new Date(job.date).toLocaleDateString()
                              : "—"}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {getStatusIcon(job.status)}
                            <Text style={styles.jobMetaText}>
                              {getStatusLabel(job.status)}
                            </Text>
                          </View>
                        </View>
                        {job.status === "completed" && (
                          <TouchableOpacity
                            style={[styles.saveButton, { marginTop: 8 }]}
                            onPress={() => {
                              setRatingJobId(job.id);
                              setRatingModalVisible(true);
                            }}
                          >
                            <Ionicons name="star" size={20} color="#fff" />
                            <Text style={styles.saveButtonText}>
                              Değerlendir
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))
                  )}
                </View>
              )}

              {detailTab === "reminders" && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Hatırlatıcılar</Text>
                    <TouchableOpacity
                      onPress={() => dispatch({ type: "openReminder" })}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={Colors.light.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  {remindersForSelected.length === 0 ? (
                    <Text style={styles.emptyText}>Henüz hatırlatıcı yok</Text>
                  ) : (
                    remindersForSelected.map((r) => (
                      <View key={r.id} style={styles.reminderItem}>
                        <View style={styles.jobRow}>
                          <TouchableOpacity
                            onPress={() =>
                              selectedCar &&
                              toggleReminderCompleted(selectedCar.id, r.id)
                            }
                          >
                            <Ionicons
                              name={
                                r.isCompleted ? "checkbox" : "square-outline"
                              }
                              size={18}
                              color={
                                r.isCompleted
                                  ? Colors.light.success
                                  : Colors.light.tabIconDefault
                              }
                            />
                          </TouchableOpacity>
                          <Ionicons name="time" size={16} color={"#FF9500"} />
                          <Text
                            style={[
                              styles.jobTitle,
                              r.isCompleted
                                ? {
                                    textDecorationLine: "line-through",
                                    color: Colors.light.tabIconDefault,
                                  }
                                : null,
                            ]}
                          >
                            {r.title}
                          </Text>
                        </View>
                        {!!r.dueDate && (
                          <Text
                            style={[
                              styles.jobDesc,
                              r.isCompleted
                                ? { textDecorationLine: "line-through" }
                                : null,
                            ]}
                          >
                            Tarih: {r.dueDate}
                          </Text>
                        )}
                        {!!r.dueMileage && (
                          <Text
                            style={[
                              styles.jobDesc,
                              r.isCompleted
                                ? { textDecorationLine: "line-through" }
                                : null,
                            ]}
                          >
                            Km: {r.dueMileage}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={() => openEditReminder(r)}
                          style={{ marginTop: 6 }}
                        >
                          <Text
                            style={{
                              color: Colors.light.primary,
                              fontWeight: "600",
                            }}
                          >
                            Düzenle
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={ratingModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Değerlendirme</Text>
              <TouchableOpacity
                onPress={() => {
                  setRatingModalVisible(false);
                  setRatingJobId(null);
                  setRatingValue(0);
                }}
              >
                <Ionicons name="close" size={22} color={"#999"} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRatingValue(n)}>
                  <Ionicons
                    name={n <= ratingValue ? "star" : "star-outline"}
                    size={28}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 12 }]}
              onPress={() => {
                setRatingModalVisible(false);
                setRatingJobId(null);
                setRatingValue(0);
              }}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={state.reminder} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingReminderId
                  ? "Hatırlatıcıyı Düzenle"
                  : "Hatırlatıcı Ekle"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch({ type: "closeReminder" });
                  resetReminderForm();
                }}
              >
                <Ionicons name="close" size={22} color={"#999"} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Başlık</Text>
              <TextInput
                value={remTitle}
                onChangeText={setRemTitle}
                placeholder="Örn: Bakım"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tarih (YYYY-MM-DD)</Text>
              <TextInput
                value={remDate}
                onChangeText={setRemDate}
                placeholder="2025-12-30"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kilometre</Text>
              <TextInput
                value={remMileage}
                onChangeText={setRemMileage}
                placeholder="50000"
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { opacity: canSaveReminder ? 1 : 0.6 },
              ]}
              disabled={!canSaveReminder}
              onPress={saveReminder}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.secondary,
    marginBottom: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  listContent: { paddingBottom: 16 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: Colors.light.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  inputGroup: { marginVertical: 6 },
  inputLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
    gap: 8,
  },
  saveButtonText: { color: "white", fontWeight: "700", fontSize: 15 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  label: { width: 60, fontSize: 12, color: Colors.light.tabIconDefault },
  value: { fontSize: 14, color: Colors.light.text },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.light.text },
  emptyText: { fontSize: 12, color: Colors.light.tabIconDefault },
  jobItem: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
    marginTop: 8,
  },
  jobRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  jobTitle: { fontSize: 13, fontWeight: "600", color: Colors.light.text },
  jobDesc: { fontSize: 12, color: Colors.light.tabIconDefault, marginTop: 2 },
  jobMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  jobMetaText: { fontSize: 11, color: Colors.light.tabIconDefault },
  reminderItem: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
    marginTop: 8,
  },
});
