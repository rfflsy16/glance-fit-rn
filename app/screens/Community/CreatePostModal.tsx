import { View, Text, StyleSheet, Modal, TextInput, Pressable, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface CreatePostModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSend: (content: string) => void;
}

export default function CreatePostModal({ isVisible, onClose, onSend }: CreatePostModalProps) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [postContent, setPostContent] = useState('');
    
    const handlePost = () => {
        if(postContent.trim()) {
            onSend(postContent);
            setPostContent('');
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={[styles(theme).container, { paddingTop: insets.top }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles(theme).header}>
                    <Pressable onPress={onClose}>
                        <Ionicons name="close" size={28} color={theme.textPrimary} />
                    </Pressable>
                    
                    <Text style={styles(theme).title}>Buat Postingan</Text>
                    
                    <TouchableOpacity 
                        style={[
                            styles(theme).postButton,
                            !postContent && { opacity: 0.5 }
                        ]}
                        onPress={handlePost}
                        disabled={!postContent}
                    >
                        <Text style={styles(theme).postButtonText}>Posting</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <ScrollView 
                    contentContainerStyle={styles(theme).scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* User Info */}
                    <View style={styles(theme).userInfo}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                            style={styles(theme).avatar}
                        />
                        <View>
                            <Text style={styles(theme).username}>You</Text>
                            <TouchableOpacity style={styles(theme).audienceButton}>
                                <Ionicons name="earth" size={14} color={theme.textSecondary} />
                                <Text style={styles(theme).audienceText}>Publik</Text>
                                <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Input Area */}
                    <TextInput
                        placeholder="Apa yang ingin kamu bagikan?"
                        placeholderTextColor={theme.textSecondary}
                        style={styles(theme).input}
                        multiline
                        value={postContent}
                        onChangeText={setPostContent}
                        autoFocus
                        cursorColor={theme.primary}
                    />
                </ScrollView>

                {/* Bottom Toolbar */}
                <View style={styles(theme).toolbar} >
                    <TouchableOpacity style={styles(theme).toolbarButton}>
                        <Ionicons name="image" size={24} color="#4CAF50" />
                        <Text style={styles(theme).toolbarText}>Foto/Video</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles(theme).toolbarButton}>
                        <Ionicons name="person-add" size={24} color="#2196F3" />
                        <Text style={styles(theme).toolbarText}>Tag Orang</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles(theme).toolbarButton}>
                        <Ionicons name="location" size={24} color="#F44336" />
                        <Text style={styles(theme).toolbarText}>Lokasi</Text>
                    </TouchableOpacity>
                </View>

                {/* Advanced Options */}
                <View style={[styles(theme).advancedOptions, { marginBottom: insets.bottom }]}>
                    <TouchableOpacity style={styles(theme).optionButton}>
                        <Ionicons name="albums" size={20} color={theme.textSecondary} />
                        <Text style={styles(theme).optionText}>Album</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles(theme).optionButton}>
                        <Ionicons name="happy" size={20} color={theme.textSecondary} />
                        <Text style={styles(theme).optionText}>Perasaan</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles(theme).optionButton}>
                        <Ionicons name="pricetag" size={20} color={theme.textSecondary} />
                        <Text style={styles(theme).optionText}>Produk</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: theme.border
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textPrimary
    },
    postButton: {
        backgroundColor: theme.primary,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    postButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4
    },
    audienceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 6,
        borderRadius: 6,
        backgroundColor: theme.cardBackground
    },
    audienceText: {
        fontSize: 12,
        color: theme.textSecondary
    },
    input: {
        fontSize: 16,
        color: theme.textPrimary,
        minHeight: 200,
        textAlignVertical: 'top',
        lineHeight: 24
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    toolbarButton: {
        alignItems: 'center',
        gap: 4
    },
    toolbarText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    advancedOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    optionButton: {
        alignItems: 'center',
        gap: 4
    },
    optionText: {
        fontSize: 12,
        color: theme.textSecondary
    }
});




