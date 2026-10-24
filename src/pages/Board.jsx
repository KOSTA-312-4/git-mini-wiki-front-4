import React, { useState } from 'react';
import { Button, Table, Form, Alert } from 'react-bootstrap';

// 과일농장 게시판 컴포넌트
const Board = () => {

    // ---------------------- 게시글 목록 상태 ----------------------
    // 화면에 출력할 게시물 목록 (초기 더미 데이터 4개)
    const [boardList, setBoardList] = useState([
        { no: "1", title: '111', description: '123', viewCount: 1 },
        { no: "2", title: '222', description: '234', viewCount: 2 },
        { no: "3", title: '333', description: '345', viewCount: 1 },
        { no: "4", title: '444', description: '456', viewCount: 1 }
    ]);

    // ---------------------- 화면 모드 관리용 상태 ----------------------
    // 어떤 화면을 보여줄지 제어하는 플래그들
    const [listOk, setListOk] = useState(true);   // 게시글 전체 리스트 보기 상태
    const [readOk, setReadOk] = useState(false);  // 게시글 읽기 화면 상태
    const [writeOk, setWriteOk] = useState(false); // 게시글 작성 화면 상태
    const [editOk, setEditOk] = useState(false);  // 게시글 수정 화면 상태

    // 현재 선택해서 보고 있는 게시글 정보 (읽기 화면에서 사용)
    const [boardInfo, setBoardInfo] = useState({});

    // ---------------------- 작성 폼 상태 ----------------------
    const [title, setTitle] = useState('');            // 새 글 제목
    const [description, setDescription] = useState(''); // 새 글 내용

    // ---------------------- 수정 폼 상태 ----------------------
    const [editNo, setEditNo] = useState(null);         // 수정할 게시물 번호
    const [editTitle, setEditTitle] = useState('');     // 수정 폼에 보여줄 제목
    const [editDescription, setEditDescription] = useState(''); // 수정 폼에 보여줄 내용

    // ---------------------- 오류 메시지 상태 ----------------------
    const [errorMessage, setErrorMessage] = useState(''); // 유효성 검사 실패 시 메시지

    // ====================== 공통 함수 영역 ======================

    // ▶ 게시글 목록 화면으로 전환하는 함수
    const boardListView = () => {
        // 읽기/쓰기/수정 화면은 모두 false
        setReadOk(false);
        setWriteOk(false);
        setEditOk(false);

        // 목록 화면만 true
        setListOk(true);
    };

    // ▶ 게시글 읽기 화면으로 전환 + 조회수 증가
    const boardRead = (no) => {
        // 먼저 화면 모드 전환
        setListOk(false);
        setWriteOk(false);
        setEditOk(false);
        setReadOk(true);

        // 1) 클릭한 게시글의 조회수 1 증가
        const updatedList = boardList.map(b =>
            b.no === no ? { ...b, viewCount: b.viewCount + 1 } : b
        );
        // 변경된 리스트로 상태 업데이트 → 화면 전체 다시 렌더링
        setBoardList(updatedList);

        // 2) 클릭한 게시글 정보 찾기
        const selectedBoard = boardList.find(b => b.no === no);
        // 읽기 화면에 보여줄 게시글 정보 저장
        setBoardInfo(selectedBoard);
    };

    // ▶ 게시글 작성 화면으로 전환
    const boardWrite = () => {
        setListOk(false);   // 목록 감추고
        setWriteOk(true);   // 작성 폼 보이기
        setReadOk(false);
        setEditOk(false);
    };

    // ▶ 새 글 저장 (등록 기능)
    const boardSave = () => {
        // 1) 유효성 검사: 제목이나 내용이 비어 있으면 경고
        if (title.trim() === '' || description.trim() === '') {
            setErrorMessage('제목과 내용을 모두 입력해주세요!');
            return; // 저장 막기
        }

        // 2) 새 글 객체 생성
        const newBoard = {
            // 번호는 단순히 현재 리스트 길이 + 1 (실제 서비스라면 PK 사용)
            no: (boardList.length + 1).toString(),
            title: title,
            description: description,
            viewCount: 0  // 처음 등록 시 조회수는 0
        };

        // 3) 기존 리스트에 새 글 추가 (불변성 유지)
        setBoardList([...boardList, newBoard]);

        // 4) 입력창 초기화
        setTitle('');
        setDescription('');
        setErrorMessage(''); // 오류 메시지도 초기화

        // 5) 다시 목록 화면으로 이동
        boardListView();
    };

    // ▶ 게시글 삭제 기능
    const boardDelete = (no) => {
        // 전달받은 번호와 다른 게시글만 남기고 필터링 → 해당 글 삭제 효과
        const updatedList = boardList.filter(b => b.no !== no.toString());
        // 필터링 결과로 상태 업데이트
        setBoardList(updatedList);

        // 삭제 후 목록 화면으로 이동
        boardListView();
    };

    // ▶ 게시글 수정 화면 열기
    const boardEdit = (no) => {
        // 수정 폼 화면만 true로
        setEditOk(true);
        setListOk(false);
        setReadOk(false);
        setWriteOk(false);

        // 수정할 게시글 찾기
        const boardToEdit = boardList.find(b => b.no === no);

        // 수정 폼 상태에 값 세팅
        setEditNo(boardToEdit.no);                  // 번호
        setEditTitle(boardToEdit.title);            // 기존 제목
        setEditDescription(boardToEdit.description); // 기존 내용
    };

    // ▶ 수정된 게시글 저장 (수정 기능)
    const updateBoard = () => {
        // map을 돌며 수정 대상 번호와 일치하면 제목/내용 교체
        const updatedBoardList = boardList.map(b =>
            b.no === editNo
                ? { ...b, title: editTitle, description: editDescription }
                : b
        );

        // 게시글 목록 상태를 수정된 리스트로 갱신
        setBoardList(updatedBoardList);

        // 수정 후 목록 화면으로 이동
        boardListView();
    };

    // ====================== JSX 반환 ======================
    return (
        <div className="container" style={{ marginTop: "80px" }}>
            <h3>깃냥이 게시판</h3>

            {/* ---------------------- 게시글 목록 보기 화면 ---------------------- */}
            {listOk && (
                <div style={{ marginTop: "30px" }}>
                    <Table striped bordered hover center='true'>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                {/* <th>문의글</th> */}
                                <th>조회수</th>
                                <th>문의하기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 최신 글이 위로 오게 하기 위해 reverse() 사용 */}
                            {boardList.slice().reverse().map(board => (
                                <tr key={board.no}>
                                    <td>{board.no}</td>

                                    {/* 제목 클릭 시 읽기 화면으로 이동 */}
                                    <td
                                        style={{ cursor: 'pointer', textAlign: 'left' }}
                                        onClick={() => boardRead(board.no)}
                                    >
                                        {board.title}
                                    </td>

                                    {/* 내용 일부 클릭 시도 읽기 화면으로 이동 */}
                                    {/* <td
                                        style={{ cursor: 'pointer', textAlign: 'left' }}
                                        onClick={() => boardRead(board.no)}
                                    >
                                        {board.description}
                                    </td> */}

                                    {/* 현재 조회수 표시 */}
                                    <td>{board.viewCount}</td>

                                    <td>
                                        {/* 읽기 버튼 */}
                                        {/* <Button
                                            variant="outline-primary"
                                            onClick={() => boardRead(board.no)}
                                        >
                                            게시글읽기
                                        </Button> */}

                                        {/* 수정 버튼 */}
                                        <Button
                                            variant="outline-success"
                                            onClick={() => boardEdit(board.no)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            수정
                                        </Button>

                                        {/* 삭제 버튼 */}
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => boardDelete(board.no)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* 새 글 작성 화면으로 전환 */}
                    <Button
                        variant="primary"
                        onClick={boardWrite}
                        style={{ float: 'right' }}
                    >
                        문의글 작성하기
                    </Button>
                </div>
            )}

            {/* ---------------------- 게시글 읽기 화면 ---------------------- */}
            {readOk && (
                <div>
                    <h5 style={{ textAlign: "left" }}>{boardInfo.title}</h5>
                    <hr />
                    <p style={{ textAlign: "left" }}>{boardInfo.description}</p>
                    <br />
                    <div style={{ textAlign: "right" }}>
                        <Button
                            variant="secondary"
                            onClick={boardListView}
                            style={{ textAlign: "right" }}
                        >
                            목록으로
                        </Button>
                    </div>
                </div>
            )}

            {/* ---------------------- 새 글 작성 폼 화면 ---------------------- */}
            {writeOk && (
                <div style={{ marginTop: "30px" }}>
                    <h5 style={{ textAlign: "left" }}>문의글 남기기</h5>

                    {/* 유효성 검사 실패 시 경고창 */}
                    {errorMessage && (
                        <Alert variant="danger">{errorMessage}</Alert>
                    )}

                    {/* 제목 입력 */}
                    <Form.Group controlId="formName">
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="게시글을 입력하세요"
                        />
                    </Form.Group>

                    {/* 내용 입력 */}
                    <Form.Group controlId="formDescription" style={{ marginTop: "30px" }}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="게시물에 작성하세요"
                        />
                    </Form.Group>

                    <br />
                    <div style={{ textAlign: "right" }}>
                        {/* 저장 버튼 → boardSave 호출 */}
                        <Button
                            variant="primary"
                            onClick={boardSave}
                            style={{ marginRight: "10px" }}
                        >
                            저장
                        </Button>

                        {/* 목록으로 돌아가기 */}
                        <Button variant="secondary" onClick={boardListView}>
                            목록으로
                        </Button>
                    </div>
                </div>
            )}

            {/* ---------------------- 게시글 수정 폼 화면 ---------------------- */}
            {editOk && (
                <div style={{ marginTop: "30px" }}>
                    <h5 style={{ textAlign: "left" }}>게시물 수정</h5>

                    {/* 제목 수정 입력 */}
                    <Form.Group controlId="formEditName">
                        <Form.Control
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="수정된 제목"
                        />
                    </Form.Group>

                    <br />

                    {/* 내용 수정 입력 */}
                    <Form.Group controlId="formEditDescription">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="수정된 설명"
                        />
                    </Form.Group>

                    <br />
                    <div style={{ textAlign: 'right' }}>
                        {/* 수정 저장 버튼 */}
                        <Button
                            variant="outline-success"
                            onClick={updateBoard}
                            style={{ marginRight: "10px" }}
                        >
                            수정
                        </Button>

                        {/* 목록으로 버튼 */}
                        <Button
                            variant="outline-info"
                            onClick={boardListView}
                        >
                            목록으로
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Board;