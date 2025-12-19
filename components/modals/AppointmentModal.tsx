import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Car } from '@/types';

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (carId: string, note: string) => void;
  cars: Car[];
}

export default function AppointmentModal({
  visible,
  onClose,
  onSubmit,
  cars,
}: AppointmentModalProps) {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (visible && cars.length > 0 && !selectedCarId) {
      setSelectedCarId(cars[0].id);
    }
  }, [visible, cars]);

  const handleSubmit = () => {
    if (!selectedCarId || note.trim().length === 0) {
      Alert.alert("Eksik Bilgi", "Araç ve randevu nedeni gerekli.");
      return;
    }
    onSubmit(selectedCarId, note);
    setNote(''); // Clear note after submit
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentSmall}>
          <View style={styles.modalHeaderSmall}>
            <Text style={styles.modalTitle}>Randevu Al</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={22}
                color={Colors.light.tabIconDefault}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailLabel}>Araç Seç</Text>
          <ScrollView style={{ maxHeight: 160 }}>
            {cars.map((car: Car) => (
              <TouchableOpacity
                key={car.id}
                style={[
                  styles.carOption,
                  selectedCarId === car.id && styles.carOptionActive,
                ]}
                onPress={() => setSelectedCarId(car.id)}
              >
                <Text style={styles.carOptionText}>
                  {car.brand} {car.model} • {car.plate}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.detailLabel, { marginTop: 10 }]}>
            Kısa Arıza Bilgisi
          </Text>
          <View style={styles.noteBox}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Örn: Frenlerden ses geliyor"
              placeholderTextColor={Colors.light.tabIconDefault}
              style={{ fontSize: 14, color: Colors.light.text }}
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.appointmentSubmit}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.appointmentSubmitText}>Randevu Talep Et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContentSmall: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeaderSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  carOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  carOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: "rgba(33, 150, 243, 0.05)",
  },
  carOptionText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  noteBox: {
    height: 80,
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: Colors.light.background,
  },
  appointmentSubmit: {
    flexDirection: "row",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentSubmitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
