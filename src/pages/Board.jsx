import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const BOARD_KEY = 'gitnyang-board';

// 초기 더미 데이터 (저장된 게시글이 없을 때만 사용)
const DEFAULT_BOARD_LIST = [
    { no: "1", userId: 'guest', baskets: [], title: '111', description: '123', viewCount: 1 },
    { no: "2", userId: 'guest', baskets: [], title: '222', description: '234', viewCount: 2 },
    { no: "3", userId: 'guest', baskets: [], title: '333', description: '345', viewCount: 1 },
    { no: "4", userId: 'guest', baskets: [], title: '444', description: '456', viewCount: 1 }
];

function loadBoardList() {
    try {
        const saved = JSON.parse(localStorage.getItem(BOARD_KEY));
        if (Array.isArray(saved)) return saved;
    } catch {
        // 파싱 실패 시 기본값 사용
    }
    return DEFAULT_BOARD_LIST;
}

const Board = () => {

    // ---------------------- 로그인 유저 / 냥바구니 ----------------------
    const loginUser = useSelector((s) => s.loginUser);
    const baskets = useSelector((s) => s.baskets);
    const favorites = useSelector((s) => s.favorites);

    // 로그인한 유저의 냥바구니 목록 (담긴 레포의 name/url 포함)
    const myBaskets = loginUser
        ? baskets
            .filter((b) => b.userId === loginUser.email)
            .map((b) => ({
                id: b.id,
                name: b.name,
                repos: b.repoIds
                    .map((repoId) => favorites.find((f) => f.id === repoId))
                    .filter(Boolean)
                    .map((f) => ({ id: f.id, name: f.name, html_url: f.html_url })),
            }))
        : [];

    // ---------------------- 게시글 목록 상태 ----------------------
    // 화면에 출력할 게시물 목록 (초기 더미 데이터 4개)
    const [boardList, setBoardList] = useState(loadBoardList);

    // 게시글이 바뀔 때마다 localStorage 에 저장 (페이지 이동/새로고침해도 유지)
    useEffect(() => {
        try {
            localStorage.setItem(BOARD_KEY, JSON.stringify(boardList));
        } catch {
            // 저장 공간을 사용할 수 없는 경우 무시
        }
    }, [boardList]);

    // ---------------------- 화면 모드 관리용 상태 ----------------------
    // 어떤 화면을 보여줄지 제어하는 플래그들
    const [listOk, setListOk] = useState(true);   // 게시글 전체 리스트 보기 상태
    const [readOk, setReadOk] = useState(false);  // 게시글 읽기 화면 상태
    const [writeOk, setWriteOk] = useState(false); // 게시글 작성 화면 상태
    const [editOk, setEditOk] = useState(false);  // 게시글 수정 화면 상태

    // 현재 선택해서 보고 있는 게시글 정보 (읽기 화면에서 사용)
    const [boardInfo, setBoardInfo] = useState({});

    // ---------------------- 댓글 상태 ----------------------
    const [commentText, setCommentText] = useState('');        // 새 댓글 입력값
    const [editCommentId, setEditCommentId] = useState(null);  // 수정 중인 댓글 id
    const [editCommentText, setEditCommentText] = useState(''); // 수정 중인 댓글 내용

    // 읽기 화면에서는 항상 최신 목록의 글을 사용 (댓글 변경 즉시 반영)
    const currentPost = boardList.find(b => b.no === boardInfo.no) || boardInfo;
    const comments = currentPost.comments || [];

    // 특정 글의 댓글 목록을 갱신하는 공통 함수
    const updateComments = (no, fn) =>
        setBoardList(list => list.map(b =>
            b.no === no ? { ...b, comments: fn(b.comments || []) } : b
        ));

    // ▶ 댓글 등록
    const commentAdd = () => {
        if (!loginUser) {
            alert('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
        if (commentText.trim() === '') return;
        updateComments(currentPost.no, cs => [
            ...cs,
            { id: Date.now(), userId: loginUser.id, content: commentText.trim() }
        ]);
        setCommentText('');
    };

    // ▶ 댓글 수정 시작 (작성자만)
    const commentEditStart = (c) => {
        if (!loginUser || c.userId !== loginUser.id) return;
        setEditCommentId(c.id);
        setEditCommentText(c.content);
    };

    // ▶ 댓글 수정 저장 (작성자만)
    const commentUpdate = () => {
        if (editCommentText.trim() === '') return;
        updateComments(currentPost.no, cs => cs.map(c =>
            c.id === editCommentId && loginUser && c.userId === loginUser.id
                ? { ...c, content: editCommentText.trim() }
                : c
        ));
        setEditCommentId(null);
        setEditCommentText('');
    };

    // ▶ 댓글 삭제 (작성자만)
    const commentDelete = (id) => {
        updateComments(currentPost.no, cs => cs.filter(c =>
            !(c.id === id && loginUser && c.userId === loginUser.id)
        ));
    };

    // ---------------------- 작성 폼 상태 ----------------------
    const [title, setTitle] = useState('');            // 새 글 제목
    const [description, setDescription] = useState(''); // 새 글 내용
    const [basketIds, setBasketIds] = useState([]);     // 새 글에 첨부할 냥바구니 id들

    // ---------------------- 수정 폼 상태 ----------------------
    const [editNo, setEditNo] = useState(null);         // 수정할 게시물 번호
    const [editTitle, setEditTitle] = useState('');     // 수정 폼에 보여줄 제목
    const [editDescription, setEditDescription] = useState(''); // 수정 폼에 보여줄 내용
    const [editBasketIds, setEditBasketIds] = useState([]);     // 수정 폼에 보여줄 첨부 냥바구니 id들

    // 냥바구니 체크박스 토글 공통 함수
    const toggleId = (list, setList, id) =>
        setList(list.includes(id) ? list.filter(n => n !== id) : [...list, id]);

    // 선택한 냥바구니 id들을 게시글에 저장할 스냅샷으로 변환 (이미 사라진 바구니는 prev에서 유지)
    const buildBaskets = (ids, prev = []) =>
        ids
            .map(id => myBaskets.find(b => b.id === id) || prev.find(b => b.id === id))
            .filter(Boolean);

    // 작성자 본인 여부
    const isOwner = (board) => !!loginUser && board.userId === loginUser.id;

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

        setEditCommentId(null);
        setCommentText('');

        // 2) 클릭한 게시글 정보 찾기
        const selectedBoard = boardList.find(b => b.no === no);
        // 읽기 화면에 보여줄 게시글 정보 저장
        setBoardInfo(selectedBoard);
    };

    // ▶ 게시글 작성 화면으로 전환
    const boardWrite = () => {
        if (!loginUser) {
            alert('로그인 후 작성할 수 있습니다.');
            return;
        }
        setBasketIds([]);
        setListOk(false);   // 목록 감추고
        setWriteOk(true);   // 작성 폼 보이기
        setReadOk(false);
        setEditOk(false);
    };

    // ▶ 새 글 저장 (등록 기능)
    const boardSave = () => {
        if (!loginUser) {
            setErrorMessage('로그인 후 작성할 수 있습니다.');
            return;
        }
        // 1) 유효성 검사: 제목이나 내용이 비어 있으면 경고
        if (title.trim() === '' || description.trim() === '') {
            setErrorMessage('제목과 내용을 모두 입력해주세요!');
            return; // 저장 막기
        }

        // 2) 새 글 객체 생성
        const newBoard = {
            // 번호는 단순히 현재 리스트 길이 + 1 (실제 서비스라면 PK 사용)
            no: (Math.max(0, ...boardList.map(b => Number(b.no))) + 1).toString(),
            userId: loginUser.id,       // 작성자 (로그인 유저 id)
            baskets: buildBaskets(basketIds), // 첨부한 냥바구니 (이름 + 담긴 레포)
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
        const target = boardList.find(b => b.no === no.toString());
        if (!target || !isOwner(target)) {
            alert('작성자만 삭제할 수 있습니다.');
            return;
        }
        // 전달받은 번호와 다른 게시글만 남기고 필터링 → 해당 글 삭제 효과
        const updatedList = boardList.filter(b => b.no !== no.toString());
        // 필터링 결과로 상태 업데이트
        setBoardList(updatedList);

        // 삭제 후 목록 화면으로 이동
        boardListView();
    };

    // ▶ 게시글 수정 화면 열기
    const boardEdit = (no) => {
        const target = boardList.find(b => b.no === no);
        if (!target || !isOwner(target)) {
            alert('작성자만 수정할 수 있습니다.');
            return;
        }
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
        setEditBasketIds((boardToEdit.baskets || []).map(b => b.id)); // 기존 첨부 냥바구니
    };

    // ▶ 수정된 게시글 저장 (수정 기능)
    const updateBoard = () => {
        // map을 돌며 수정 대상 번호와 일치하면 제목/내용 교체
        const updatedBoardList = boardList.map(b =>
            b.no === editNo
                ? { ...b, title: editTitle, description: editDescription, baskets: buildBaskets(editBasketIds, b.baskets) }
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
                                <th>작성자</th>
                                <th>냥바구니</th>
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

                                    <td>{board.userId}</td>
                                    <td style={{ textAlign: 'left' }}>
                                        {(board.baskets || []).map(bk => (
                                            <Badge key={bk.id} bg="secondary" style={{ marginRight: "4px" }}>{bk.name}</Badge>
                                        ))}
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

                                        {/* 수정/삭제는 작성자 본인에게만 표시 */}
                                        {isOwner(board) && (<>
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
                                        </>)}
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
                    <div style={{ textAlign: "left" }}>작성자: {boardInfo.userId}</div>
                    {(boardInfo.baskets || []).map(bk => (
                        <div key={bk.id} style={{ textAlign: "left", marginTop: "10px" }}>
                            <strong>🧺 {bk.name}</strong>
                            <ul style={{ marginBottom: 0 }}>
                                {bk.repos.length === 0 && <li className="text-muted">담긴 레포가 없습니다.</li>}
                                {bk.repos.map(repo => (
                                    <li key={repo.id}>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <hr />
                    <p style={{ textAlign: "left" }}>{boardInfo.description}</p>

                    {/* ---------------------- 댓글 ---------------------- */}
                    <hr />
                    <h6 style={{ textAlign: "left" }}>댓글 {comments.length}</h6>
                    {comments.length === 0 && (
                        <div className="text-muted" style={{ textAlign: "left" }}>첫 댓글을 남겨보세요.</div>
                    )}
                    {comments.map(c => (
                        <div key={c.id} style={{ textAlign: "left", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                            <strong>{c.userId}</strong>
                            {editCommentId === c.id ? (
                                <div style={{ marginTop: "6px" }}>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                    />
                                    <div style={{ textAlign: "right", marginTop: "6px" }}>
                                        <Button size="sm" variant="outline-success" onClick={commentUpdate} style={{ marginRight: "6px" }}>저장</Button>
                                        <Button size="sm" variant="outline-secondary" onClick={() => setEditCommentId(null)}>취소</Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                                    <span style={{ whiteSpace: "pre-wrap" }}>{c.content}</span>
                                    {loginUser && c.userId === loginUser.id && (
                                        <span style={{ whiteSpace: "nowrap" }}>
                                            <Button size="sm" variant="outline-success" onClick={() => commentEditStart(c)}>수정</Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => commentDelete(c.id)} style={{ marginLeft: "6px" }}>삭제</Button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* 댓글 작성 (로그인 유저만) */}
                    {loginUser ? (
                        <div style={{ marginTop: "12px" }}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={`${loginUser.id}님, 댓글을 입력하세요`}
                            />
                            <div style={{ textAlign: "right", marginTop: "6px" }}>
                                <Button size="sm" variant="primary" onClick={commentAdd}>댓글 등록</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted" style={{ textAlign: "left", marginTop: "12px" }}>
                            로그인 후 댓글을 작성할 수 있습니다.
                        </div>
                    )}
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

                    <Form.Group style={{ marginTop: "20px", textAlign: "left" }}>
                        <Form.Label>첨부할 냥바구니 선택</Form.Label>
                        {myBaskets.length === 0 && <div className="text-muted">생성한 냥바구니가 없습니다.</div>}
                        {myBaskets.map(bk => (
                            <Form.Check
                                key={bk.id}
                                type="checkbox"
                                label={`${bk.name} (${bk.repos.length})`}
                                checked={basketIds.includes(bk.id)}
                                onChange={() => toggleId(basketIds, setBasketIds, bk.id)}
                            />
                        ))}
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

                    <Form.Group style={{ marginTop: "20px", textAlign: "left" }}>
                        <Form.Label>첨부할 냥바구니 선택</Form.Label>
                        {myBaskets.length === 0 && <div className="text-muted">생성한 냥바구니가 없습니다.</div>}
                        {myBaskets.map(bk => (
                            <Form.Check
                                key={bk.id}
                                type="checkbox"
                                label={`${bk.name} (${bk.repos.length})`}
                                checked={editBasketIds.includes(bk.id)}
                                onChange={() => toggleId(editBasketIds, setEditBasketIds, bk.id)}
                            />
                        ))}
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