## 코어 컴포넌트
- View : 화면 구성 기본
    - 안드로이드 View, 웹에서 div 역할
- SafeAreaView : 모바일 기기 안전한구역 View
- ScrollView : 스크롤 있는 View
    - 안드로이드 ScrollView, 웹에서 div 역할
- Text : 텍스트 표시
    - 안드로이드 Text, 웹에서 p 역할
- Image : 이미지 표시
- TextInput : 택스트 앱에 입력하기 위한 요소
    - 안드로이드 EditText, 웹에서 input type='text' 역할
- Button : 버튼 표시
- Switch : bool값 표시 (스위치)
- TouchableOpacity : 버튼 클릭하면 투명도 변화주어 시각적 효과 부여
    - 원하는 View에 감싸서(레이아웃마냥) 사용가능함.

## 리액트의 기능
- useState 똑같이 사용 가능
- props도 똑같이 사용가능
- onPress()메소드를 통해 onClick과 같은 효과 부여 가능 (터치시 발동)

## 네이티브 기능
- ListView는 FlatList, SectionList로 사용가능함.
    - FlatList = data에 배열로 된 데이터들을 넣고 renderItem을 통해 해당 배열 내의 애들을 보여줌.
    - SectionList = sections 속성에 배열로 dictionary를 넣음. title, data배열로 타이틀 그리고 해당 타이틀 내의 데이터들을 입력가능.

## 기초
- **View는 Container이다. div처럼 View를 사용한다. 항상 Import되어있어야 한다.**
- **React Native에서의 모든 텍스트는 Text 컴포넌트 내부에 들어가있어야 한다. 브라우저아니니까 착각X**
- StyleSheet.create는 StyleSheet object생성에 사용. create내부 인자로 object{}가 들어가있다.
- StyleSheet를 통해 스타일 지정하는사람도 있다. 컴포넌트별 정리도 편함. 하지만 꼭 정답은 아니고, 그냥 각 태그에 직접 Style을 넣는방법도 있겠지.  
꼭 필요한 Object는 아니다. 선택한다면... 나는 스타일을 따로 두고싶을듯? StyleSheet 객체 생성안하고 할수도 있지만 자도오안성이 안될것이다. (단지 object일뿐)  
View안에 style정의하자니 너무 길어져서 코드 구분이 어려워질까봐 걱정. 그래서 나는 아래에 따로 정의할 것이다.
- status-bar는 뭐지?? third-party이다. 자체 native아니다. status-bar 컴포넌트는 시계, 배터리, Wifi 창을 의미한다. 화면에 보여주는 컴포넌트가 아니다.  
(일부컴포넌트는 그냥 안드로이드or iOS 운영체제와 소통하기 위한 컴포넌트이다.)  
auto로 세팅되어있는데 light로 하면 사라진것처럼 보임(흰색글자로 만들어준거임). reactnative장점은 css에러도 오류로 잡아준다. 굿.