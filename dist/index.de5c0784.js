console.log("그림판");
class DrawingBoard {
    MODE = "NONE";
    IsMouseDown = false;
    constructor(){
        this.assignElement();
        this.initContext();
        this.addEvent();
    }
    assignElement() {
        this.containerEl = document.getElementById("container");
        this.canvasEl = this.containerEl.querySelector("#canvas");
        this.toolbarEl = this.containerEl.querySelector("#toolbar");
        this.brushEl = this.containerEl.querySelector("#brush");
    }
    // 2D 캔버스 구현
    initContext() {
        this.context = this.canvasEl.getContext("2d");
    }
    addEvent() {
        this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
        this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    }
    // 마우스를 누를 때
    onMouseDown(event) {
        if (this.MODE === "NONE") return;
        this.IsMouseDown = true;
        const currentPosition = this.getMousePosition(event);
        // 2D 캔버스 그리기
        this.context.beginPath(); // 경로 시작
        this.context.moveTo(currentPosition.x, currentPosition.y); // 펜 위치 이동
        this.context.lineCap = "round"; // 펜팁
        this.context.strokeStyle = "#000000"; // 선 색상
        this.context.lineWidth = 10; // 두께
        this.context.lineTo(400, 400); // 캔버스 기준 x:400, y:400
        this.context.stroke(); // 그리기
    }
    getMousePosition(event) {
        const boundaries = this.canvasEl.getBoundingClientRect(); // 좌표 값 구하기
        return {
            x: event.clientX - boundaries.left,
            y: event.clientY - boundaries.top
        };
    }
    // 브러시를 클릭했을 때 이벤트 핸들러
    // 브러시를 눌렀을 때 상태 변경
    // (공통) 툴 클릭 시 active 클래스 추가 (활성화 상태)
    onClickBrush(event) {
        // this.MODE = 'BRUSH';
        const IsActive = event.currentTarget.classList.contains("active"); // 반복 코드 정리
        this.MODE = IsActive ? "NONE" : "BRUSH";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushEl.classList.toggle("active");
    }
}
// 인스턴스 생성
new DrawingBoard();

//# sourceMappingURL=index.de5c0784.js.map
