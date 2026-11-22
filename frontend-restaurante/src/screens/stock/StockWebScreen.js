import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    BackHandler,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import API_CONFIG from "../../config/api";
import { COLORS, SIZES } from "../../constants/theme";

export default function StockWebScreen() {
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [failed, setFailed] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    if (!canGoBack) return false;
                    webViewRef.current?.goBack();
                    return true;
                }
            );

            return () => subscription.remove();
        }, [canGoBack])
    );

    if (failed) {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.title}>Stock no está disponible</Text>
                <Text style={styles.message}>
                    Compruebe que la aplicación StockSmartRestaurantQR esté iniciada y accesible desde este dispositivo.
                </Text>
                <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.button}
                    onPress={() => setFailed(false)}
                >
                    <Text style={styles.buttonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <WebView
            ref={webViewRef}
            source={{
                uri: API_CONFIG.STOCK_WEB_URL,
                headers: {
                    "ngrok-skip-browser-warning": "smartrestaurantqr"
                }
            }}
            userAgent="SmartRestaurantQR-Restaurante/1.1.2"
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            mixedContentMode="compatibility"
            allowsBackForwardNavigationGestures
            onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
            onError={() => setFailed(true)}
            onHttpError={() => setFailed(true)}
            renderLoading={() => (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Abriendo Stock...</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    loading: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        backgroundColor: COLORS.background,
        justifyContent: "center"
    },
    loadingText: {
        color: COLORS.textLight,
        marginTop: 12
    },
    messageContainer: {
        alignItems: "center",
        backgroundColor: COLORS.background,
        flex: 1,
        justifyContent: "center",
        padding: SIZES.padding
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    message: {
        color: COLORS.textLight,
        lineHeight: 21,
        marginVertical: 16,
        textAlign: "center"
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12
    },
    buttonText: {
        color: COLORS.black,
        fontWeight: "bold"
    }
});
