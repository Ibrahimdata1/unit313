import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallbackText, Badge, BadgeText, Box, Button, ButtonText, Heading, HStack, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

// 1. Mock Data
const POSTS = [
  { 
    id: 1, 
    type: 'Investment', 
    title: 'Expanding "Only Burgers" - Rama 9 Branch', 
    owner: 'Kosit B.', 
    color: '$success600' 
  },
  { 
    id: 2, 
    type: 'Hiring', 
    title: 'QA Automation Engineer (Playwright)', 
    owner: 'Halal Tech Co.', 
    color: '$info600' 
  },
  { 
    id: 3, 
    type: 'Partnership', 
    title: 'Marketing Partner for Organic Dates', 
    owner: 'Mubarak Group', 
    color: '$warning600' 
  },
];
const fetchUserRole = async()=>{
    const {data:{user}} = await supabase.auth.getUser()
    if (!user) return null;
    const {data,error} = await supabase.from('profiles').select('is_investor, is_jobseeker, is_entrepreneur').eq('id', user.id)
    .single();
    if(error){
        console.error(error)
        return null
    }
    return data
}
export default function DashboardScreen(){
    const router = useRouter()
    return(
        <Box flex={1} bg="$secondary50">
            <Box p='$6' bg="$white" borderBottomWidth={1} borderBottomColor="$secondary200">
                <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                        <Heading size="xl" color="$success700">Unit313</Heading>
                        <Text size="sm">Muslim Connected</Text>
                    </VStack>
                    <Avatar bgColor="$success500" size="md" borderRadius='$full'>
                        <AvatarFallbackText>KB</AvatarFallbackText>
                    </Avatar>
                </HStack>
            </Box>
            <ScrollView>
                <VStack p='$4' space="md">
                    {POSTS.map((post)=>(
                        <Box key={post.id} p='$5' bg="$white" borderRadius='$xl' softShadow="2">
                            <VStack space="sm">
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Badge size="md" variant="outline" borderRadius='$full' action="info" borderColor={post.color}>
                                      <BadgeText color={post.color}>{post.type}</BadgeText>  
                                    </Badge>
                                    <Text size="xs" color="$textLight500">{post.owner}</Text>
                                </HStack>
                                <Heading size="md" mt='$2' color='$secondary900'>
                                    {post.title}
                                </Heading>
                                <Text size="sm" color="$textLight600" numberOfLines={2}>
                                     Information of Opportunity for muslim invester...
                                </Text>
                                <Button mt='$4' size="sm" variant="solid" action="primary" bg="$success600" onPress={()=>router.push('/(tabs)/postDetails'as any )}>
                                    <ButtonText>Check Details</ButtonText>
                                </Button>
                            </VStack>
                        </Box>
                    ))}
                </VStack>
            </ScrollView>
        </Box>
    )
}