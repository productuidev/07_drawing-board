console.log('그림판');

class DrawingBoard {
  MODE = 'NONE'; // 브러시 모드 : NONE BRUSH ERASER
  IsMouseDown = false; // T/F
  eraserColor = '#FFFFFF'; // 지우개 변수
  backgroundColor = '#FFFFFF'; // 배경색 변수
  IsNavigatorVisible = false; // T/F
  undoArray = [];
  containerEl;
  canvasEl;
  toolbarEl;
  brushEl;
  colorPickerEl;
  brushPanelEl;
  brushSliderEl;
  brushSizePreviewEl;
  eraserEl;
  navigatorEl;
  navigatorImageContainerEl;
  navigatorImageEl;
  undoEl;
  clearEl;

  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackgroundColor();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.getElementById('container');
    this.canvasEl = this.containerEl.querySelector('#canvas');
    this.toolbarEl = this.containerEl.querySelector('#toolbar');
    this.brushEl = this.toolbarEl.querySelector('#brush');
    this.colorPickerEl = this.toolbarEl.querySelector('#colorPicker');
    this.brushPanelEl = this.containerEl.querySelector('#brushPanel');
    this.brushSliderEl = this.brushPanelEl.querySelector('#brushSize');
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector('#brushSizePreview');
    this.eraserEl = this.toolbarEl.querySelector('#eraser');
    this.navigatorEl = this.toolbarEl.querySelector('#navigator');
    this.navigatorImageContainerEl = this.containerEl.querySelector('#imgNav');
    this.navigatorImageEl = this.containerEl.querySelector('#canvasImg');
    this.undoEl = this.toolbarEl.querySelector('#undo');
    this.clearEl = this.toolbarEl.querySelector('#clear');
  }

  // 2D 캔버스 구현
  initContext() {
    this.context = this.canvasEl.getContext('2d');
  }

  // 캔버스 초기화 (초기화 시 캔버스 크기만큼의 직사각형을 그리고 시작하는 개념)
  initCanvasBackgroundColor() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height); // fillRect(직사각형 그리기) : 캔버스 기준 0,0 좌표가 시작되는 지점, 캔버스의 너비, 캔버스 높이
  }

  addEvent() {
    this.brushEl.addEventListener('click', this.onClickBrush.bind(this));
    this.canvasEl.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasEl.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvasEl.addEventListener('mouseout', this.onMouseOut.bind(this));
    this.brushSliderEl.addEventListener(
      'input',
      this.onChangeBrushSize.bind(this),
    );
    this.colorPickerEl.addEventListener('input', this.onChangeColor.bind(this));
    this.eraserEl.addEventListener('click', this.onClickEraser.bind(this));
    this.navigatorEl.addEventListener(
      'click',
      this.onClickNavigator.bind(this),
    );
    this.undoEl.addEventListener('click', this.onClickUndo.bind(this));
    this.clearEl.addEventListener('click', this.onClickClear.bind(this));
  }

  onMouseOut() {
    if (this.MODE === 'NONE') return; // 브러시 모드가 NONE이면 진입 불가 (반환)
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  // 브러시 패널에 선택한 컬러피커의 색상 적용
  onChangeColor(event) {
    this.brushSizePreviewEl.style.backgroundColor = event.target.value;
  }

  // 브러시 패널에서 슬라이더로 브러시 사이즈 조정
  onChangeBrushSize(event) {
    this.brushSizePreviewEl.style.width = `${event.target.value}px`;
    this.brushSizePreviewEl.style.height = `${event.target.value}px`;
  }

  // 마우스를 누를 때
  onMouseDown(event) {
    if (this.MODE === 'NONE') return; // 브러시 모드가 NONE이면 진입 불가 (반환)
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(event);

    // 2D 캔버스 그리기
    this.context.beginPath(); // 경로 시작
    this.context.moveTo(currentPosition.x, currentPosition.y); // 현재 좌표로 이동
    this.context.lineCap = 'round'; // 펜팁

    // this.context.strokeStyle = '#000000'; // 선 색상
    // this.context.lineWidth = 10; // 두께
    // this.context.lineTo(400, 400); // 캔버스 기준 x:400, y:400
    // this.context.stroke(); // 그리기

    // 조건문으로 변경
    if (this.MODE === 'BRUSH') {
      this.context.strokeStyle = this.colorPickerEl.value; // 컬러피커의 값
      this.context.lineWidth = this.brushSliderEl.value; // 브러시슬라이더의 값
    } else if (this.MODE === 'ERASER') {
      // 지우개를 배경색(흰색)인 브러시로 덮는 개념이라고 보면 됨
      this.context.strokeStyle = this.eraserColor;
      this.context.lineWidth = 50;
    }

    this.saveState();
  }

  // 마우스를 움직일 때
  onMouseMove(event) {
    if (!this.IsMouseDown) return; // 마우스를 누른 게 아니면 진입 불가 (반환)

    const currentPosition = this.getMousePosition(event);
    this.context.lineTo(currentPosition.x, currentPosition.y); // 현재 좌표로 이동
    this.context.stroke(); // 그리기
  }

  // 마우스를 뗐을 때 = 마우스를 누른 게 아닌 상태
  onMouseUp() {
    if (this.MODE === 'NONE') return; // 브러시 모드가 NONE이면 진입 불가 (반환)
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  // 마우스 좌표
  getMousePosition(event) {
    const boundaries = this.canvasEl.getBoundingClientRect(); // 좌표 값 구하기
    return {
      x: event.clientX - boundaries.left, // 현재 캔버스기준 가로 시작점 부터 엘리먼트 왼쪽변 까지의 거리
      y: event.clientY - boundaries.top, // 현재 캔버스기준 세로 시작점 부터 엘리먼트 윗변 까지의 거리
    };
  }

  // 브러시를 클릭했을 때 이벤트 핸들러
  // 브러시를 눌렀을 때 상태 변경
  // (공통) 툴 클릭 시 active 클래스 추가 (활성화 상태)
  onClickBrush(event) {
    // this.MODE = 'BRUSH';
    const IsActive = event.currentTarget.classList.contains('active'); // 반복 코드 정리
    this.MODE = IsActive ? 'NONE' : 'BRUSH';
    this.canvasEl.style.cursor = IsActive ? 'default' : 'crosshair';
    this.brushPanelEl.classList.toggle('hide'); // 브러시 패널 활성화
    event.currentTarget.classList.toggle('active');
    // this.brushEl.classList.toggle('active');
    this.eraserEl.classList.remove('active');
  }

  // 지우개 기능 (브러시 기능 응용)
  // 지우개를 눌렀을 때 상태 변경
  onClickEraser() {
    const IsActive = event.currentTarget.classList.contains('active');
    this.MODE = IsActive ? 'NONE' : 'ERASER';
    this.canvasEl.style.cursor = IsActive ? 'default' : 'crosshair';
    this.brushPanelEl.classList.add('hide');
    event.currentTarget.classList.toggle('active');
    // this.eraserEl.classList.toggle('active');
    this.brushEl.classList.remove('active');
  }

  // 네비게이터(미니맵)
  onClickNavigator(event) {
    // 네비게이터가 보이지 않는 경우 그리고 있는 상태가 업데이트되지 않도록
    this.IsNavigatorVisible = !event.currentTarget.classList.contains('active'); // active를 포함하지 않는 (반대)
    event.currentTarget.classList.toggle('active');
    this.navigatorImageContainerEl.classList.toggle('hide');
    // console.log(this.canvasEl.toDataURL());
    this.updateNavigator();
  }

  // 현재 캔버스 상태를 이미지 형태로 변환하여 canvasImg에 src 형태로 업데이트하여 네비게이터(미니맵)으로 보여줄 수 있다
  // 단, 너무 자주 업데이트 시 버벅거리는 현상 > 마우스를 떼거나 밖으로 나갔을 때 업데이트
  updateNavigator() {
    if (!this.IsNavigatorVisible) return;
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  // 실행취소
  onClickUndo() {
    if (this.undoArray.length === 0) {
      alert('더 이상 실행취소는 불가합니다.');
      return;
    }

    if (this.undoArray.length === 0) return;
    let previousDataUrl = this.undoArray.pop(); // 배열의 마지막 요소 제거
    let previousImage = new Image(); // 이전 이미지 객체 생성
    previousImage.onload = () => {
      // clearRect : 캔버스의 특정 영역 지우는 메소드
      // clearRect(x, y, w, h)
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

      // drawImage : 캔버스에서 이미지를 그리는 메소드
      // drawImage(image, ix, iy, iw, ih, cx, cy, cw, ch)
      this.context.drawImage(
        previousImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
      );
    };
    previousImage.src = previousDataUrl;
  }

  // 상태 저장 (최근 5개까지만 상태만)
  // 데이터를 배열(array)로 만들어서 저장
  saveState() {
    if (this.undoArray.length > 4) {
      this.undoArray.shift();
      this.undoArray.push(this.canvasEl.toDataURL());
    } else {
      this.undoArray.push(this.canvasEl.toDataURL());
    }
    // console.log(this.undoArray);
  }

  // 캔버스 초기화
  onClickClear() {
    // 캔버스 지우기
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.undoArray = [];
    this.updateNavigator();
    this.initCanvasBackgroundColor();
  }
}

// 인스턴스 생성
new DrawingBoard();
