import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import CreatePostModal from './CreatePostModal';
import Header from '@/components/Header';

// Mock data
const mockPosts = [
    {
        id: 1,
        user: {
            name: 'FitnessGuru',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        content: 'Baru aja ngerjain challenge lari 10km! 🏃💨 Siapa yg mau join besok?',
        image: [],
        likes: 245,
        comments: [
            { id: 1, user: 'Runner123', text: 'Keren bang! Aku mau join nih' },
            { id: 2, user: 'HealthFreak', text: 'Lets gooo!! 💪' }
        ],
        timestamp: '2 jam lalu'
    },
    {
        id: 2,
        user: {
            name: 'HealthyEats',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        content: 'Meal prep hari ini: Salmon grill + quinoa 🥗 Resepnya cek di GlanceFit!',
        image: ['https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4'],
        likes: 178,
        comments: [],
        timestamp: '5 jam lalu'
    }
];

// Tambah interface utk type safety
interface Comment {
    id: number;
    user: string;
    text: string;
}

interface Post {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    image: string[];
    likes: number;
    comments: Comment[];
    timestamp: string;
}

// Helper component utk render gambar
const ImageGrid = ({ images }: { images: string[] }) => {
    if (images.length === 0) return null;
    
    return (
        <View style={{ flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {images.length === 1 ? (
                <Image source={{ uri: images[0] }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
            ) : images.length === 2 ? (
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Image source={{ uri: images[0] }} style={{ flex: 1, height: 150, borderRadius: 8 }} />
                    <Image source={{ uri: images[1] }} style={{ flex: 1, height: 150, borderRadius: 8 }} />
                </View>
            ) : images.length === 3 ? (
                <>
                    <Image source={{ uri: images[0] }} style={{ width: '100%', height: 150, borderRadius: 8 }} />
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Image source={{ uri: images[1] }} style={{ flex: 1, height: 100, borderRadius: 8 }} />
                        <Image source={{ uri: images[2] }} style={{ flex: 1, height: 100, borderRadius: 8 }} />
                    </View>
                </>
            ) : images.length >= 4 ? (
                <>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Image source={{ uri: images[0] }} style={{ flex: 1, height: 150, borderRadius: 8 }} />
                        <Image source={{ uri: images[1] }} style={{ flex: 1, height: 150, borderRadius: 8 }} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Image source={{ uri: images[2] }} style={{ flex: 1, height: 150, borderRadius: 8 }} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>+{images.length - 3}</Text>
                        </View>
                    </View>
                </>
            ) : null}
        </View>
    );
};

export default function Community() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [selectedPost, setSelectedPost] = useState<number | null>(null);
    const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
    const [posts, setPosts] = useState(mockPosts);
    
    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles(theme).postCard}>
            {/* Post Header */}
            <View style={styles(theme).postHeader}>
                <Image source={{ uri: item.user.avatar }} style={styles(theme).avatar} />
                <View style={styles(theme).postUserInfo}>
                    <Text style={styles(theme).userName}>{item.user.name}</Text>
                    <Text style={styles(theme).postTime}>{item.timestamp}</Text>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
            </View>
            
            {/* Post Content */}
            <Text style={styles(theme).postContent}>{item.content}</Text>
            
            {/* Post Image - Diubah pake ImageGrid */}
            <ImageGrid images={item.image} />
            
            {/* Post Actions */}
            <View style={styles(theme).postActions}>
                <Pressable 
                    style={styles(theme).actionButton}
                    onPress={() => setSelectedPost(selectedPost === item.id ? null : item.id)}
                >
                    <Ionicons 
                        name={selectedPost === item.id ? 'chatbubble' : 'chatbubble-outline'} 
                        size={20} 
                        color={theme.textSecondary} 
                    />
                    <Text style={styles(theme).actionText}>{item.comments.length}</Text>
                </Pressable>
                
                <Pressable style={styles(theme).actionButton}>
                    <Ionicons name="heart-outline" size={20} color={theme.textSecondary} />
                    <Text style={styles(theme).actionText}>{item.likes}</Text>
                </Pressable>
                
                <Pressable style={styles(theme).actionButton}>
                    <Ionicons name="share-social-outline" size={20} color={theme.textSecondary} />
                </Pressable>
            </View>
            
            {/* Comments Section */}
            {selectedPost === item.id && item.comments.length > 0 && (
                <View style={styles(theme).commentsSection}>
                    {item.comments.map((comment: any) => (
                        <View key={comment.id} style={styles(theme).commentItem}>
                            <Text style={styles(theme).commentUser}>{comment.user}:</Text>
                            <Text style={styles(theme).commentText}>{comment.text}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    // Fungsi handle kirim post baru
    const handleSendPost = (content: string) => {
        const newPost = {
            id: posts.length + 1,
            user: {
                name: 'Current User', // Ganti dgn data user beneran
                avatar: 'https://i.pravatar.cc/150?img=3'
            },
            content: content,
            image: [],
            likes: 0,
            comments: [],
            timestamp: 'Baru saja'
        };
        setPosts([newPost, ...posts]);
    };

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            {/* Ganti header lama dgn component Header */}
            <Header 
                title="Komunitas"
                rightContent={
                    <Pressable
                        onPress={() => navigation.navigate('Chat')}
                        style={styles(theme).headerButton}
                    >
                        <Ionicons 
                            name="chatbubble-ellipses" 
                            size={24} 
                            color={theme.iconPrimary} 
                        />
                    </Pressable>
                }
            />
            
            <FlatList
                showsVerticalScrollIndicator={false}
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles(theme).listContent}
                ListHeaderComponent={
                    <Pressable 
                        onPress={() => setIsCreatePostVisible(true)}
                        style={styles(theme).createPostCard}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image 
                                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                                style={styles(theme).avatar} 
                            />
                            <Text style={styles(theme).placeholderText}>
                                Apa yang ingin kamu bagikan?
                            </Text>
                            <Ionicons 
                                name="pencil" 
                                size={20} 
                                color={theme.textSecondary} 
                                style={{ marginLeft: 8 }}
                            />
                        </View>
                        
                        {/* Action Buttons */}
                        <View style={styles(theme).actionRow}>
                            <TouchableOpacity style={styles(theme).postButton}>
                                <Ionicons name="image" size={20} color="#4CAF50" />
                                <Text style={styles(theme).buttonText}>Foto/Video</Text>
                            </TouchableOpacity>
                            
                            <View style={styles(theme).separator} />
                            
                            <TouchableOpacity style={styles(theme).postButton}>
                                <Ionicons name="location" size={20} color="#F44336" />
                                <Text style={styles(theme).buttonText}>Lokasi</Text>
                            </TouchableOpacity>
                            
                            <View style={styles(theme).separator} />
                            
                            <TouchableOpacity style={styles(theme).postButton}>
                                <Ionicons name="people" size={20} color="#2196F3" />
                                <Text style={styles(theme).buttonText}>Teman</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                }
            />
            
            {/* Pake component modal yg udah ada */}
            <CreatePostModal
                isVisible={isCreatePostVisible}
                onClose={() => setIsCreatePostVisible(false)}
                onSend={handleSendPost}
            />
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerButton: {
        padding: 8,
        backgroundColor: theme.cardBackground,
        borderRadius: 12
    },
    listContent: {
        paddingBottom: 24,
        paddingHorizontal: 16
    },
    postCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    postUserInfo: {
        flex: 1
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary
    },
    postTime: {
        fontSize: 12,
        color: theme.textSecondary
    },
    postContent: {
        fontSize: 14,
        color: theme.textPrimary,
        lineHeight: 20,
        marginBottom: 12
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12
    },
    postActions: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    actionText: {
        fontSize: 12,
        color: theme.textSecondary
    },
    commentsSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    commentItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8
    },
    commentUser: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textPrimary
    },
    commentText: {
        fontSize: 12,
        color: theme.textSecondary,
        flex: 1
    },
    createPostCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    placeholderText: {
        color: theme.textSecondary,
        fontSize: 14
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    separator: {
        width: 1,
        backgroundColor: theme.border,
        marginHorizontal: 8
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    buttonText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    buttonIcon: {
        marginRight: 4
    }
});