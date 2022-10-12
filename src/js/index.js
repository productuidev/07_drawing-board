console.log('그림판');

class DrawingBoard {
  MODE = 'NONE'; // 브러시 모드 : NONE BRUSH ERASER

  constructor() {
    this.assignElement();
    this.initContext();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.getElementById('container');
    this.canvasEl = this.containerEl.querySelector('#canvas');
    this.toolbarEl = this.containerEl.querySelector('#toolbar');
    this.brushEl = this.containerEl.querySelector('#brush');
  }

  // 2D 캔버스 구현
  initContext() {
    this.context = this.canvasEl.getContext('2d');
  }

  // 브러시를 클릭했을 때 이벤트 핸들러
  addEvent() {
    this.brushEl.addEventListener('click', this.onClickBrush.bind(this));
  }

  // (공통) 툴 클릭 시 active 클래스 추가 (활성화 상태)

  // 브러시를 눌렀을 때 상태 변경
  onClickBrush(event) {
    // this.MODE = 'BRUSH';
    this.MODE = event.currentTarget.classList.contains('active')
      ? 'NONE'
      : 'BRUSH';
    this.canvasEl.style.cursor = event.currentTarget.classList.contains(
      'active',
    )
      ? 'default'
      : 'crosshair';
    this.brushEl.classList.toggle('active');
  }
}

// 인스턴스 생성
new DrawingBoard();
