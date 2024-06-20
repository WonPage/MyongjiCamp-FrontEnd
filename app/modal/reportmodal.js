import { Modal } from "react-native";
import React, {useState} from "react";

export default function ReportModal({visible, onClose, handleCommentReport, handlePostReport}) {
        const [reason, setReason] = useState();
        const reportOptions = [
                ADVERTISEMENT, //광고
                ABUSE, //욕설 및 비방
                ILLEGAL_CONTENT, //불법 정보
                HATE_SPEECH, //혐오 발언
                OTHER //기타
        ];
        const handleReport = () => {
                if (type === 'Post') handlePostReport(reason);
                if (type === 'Comment') handleCommentReport(reason);
        };
        return (
        <Modal visible={visible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
                                {reportOptions.map((option, index) => (
                                        <TouchableOpacity key={index} onPress={() => setReason(option)}>
                                                <Text>{option === 'ADVERTISEMENT' ? '광고' :
                                                option === 'ABUSE' ? '욕설 및 비방' :
                                                option === 'ILLEGAL_CONTENT' ? '불법 정보' :
                                                option === 'HATE_SPEECH' ? '혐오 발언' : option}</Text>
                                        </TouchableOpacity>
                                ))}
                                <Button title="신고하기" onPress={handleReport} />
                                <Button title="취소" onPress={onClose} />
                        </View>
                </View>
        </Modal>
        )
}