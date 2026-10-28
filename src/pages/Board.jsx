import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Alert, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyBaskets, selectMyFavorites, setBoard } from '../store/store';
import { alertError, errorMessage as apiErrorMessage } from '../api/auth';
import {
    addCommentRequest,
    createPostRequest,
    deleteCommentRequest,
    deletePostRequest,
    fetchPosts,
    readPostRequest,
    updateCommentRequest,
    updatePostRequest,
} from '../api/board';

const Board = () => {

    // ---------------------- 로그인 유저 / 냥바구니 ----------------------
    const loginUser = useSelector((s) => s.loginUser);
    const dispatch = useDispatch();
    const myFavorites = useSelector(selectMyFavorites);
    const myBasketList = useSelector(selectMyBaskets);

    // 로그인한 유저의 냥바구니 목록 (담긴 레포의 name/url 포함)
    const myBaskets = myBasketList.map((b) => ({
        id: b.id,
        name: b.name,
        repos: b.repoIds
            .map((repoId) => myFavorites.find((f) => f.id === repoId))
            .filter(Boolean)
            .map((f) => ({ id: f.id, name: f.name, html_url: f.html_url })),
    }));

    // ---------------------- 게시글 목록 상태 ----------------------
    // 게시글은 서버에서 불러와 Redux(board)에 보관합니다.
    const boardList = useSelector((s) => s.board);
    // 서버 응답을 기다린 뒤에도 항상 최신 목록을 기준으로 계산하도록 store 의 현재 값을 사용합니다.
    const setBoardList = (next) =>
        dispatch((dispatchNow, getState) =>
            dispatchNow(setBoard(typeof next === 'function' ? next(getState().board) : next)));

    const [loading, setLoading] = useState(true);   // 목록을 처음 불러오는 중
    const [loadError, setLoadError] = useState(''); // 목록을 불러오지 못했을 때 메시지

    // 서버에서 게시글 목록 다시 불러오기
    const loadBoard = async () => {
        try {
            dispatch(setBoard(await fetchPosts()));
            setLoadError('');
        } catch (error) {
            setLoadError(apiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // 화면을 열 때 한 번 불러오기
    useEffect(() => {
        let ignore = false;
        fetchPosts()
            .then((posts) => {
                if (!ignore) dispatch(setBoard(posts));
            })
            .catch((error) => {
                if (!ignore) setLoadError(apiErrorMessage(error));
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [dispatch]);

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

    // 읽기 화면의 댓글은 글을 읽을 때 서버에서 함께 받아 boardInfo 에 보관합니다.
    const comments = boardInfo.comments || [];

    // 읽고 있는 글의 댓글 목록을 갱신하는 공통 함수 (서버 저장이 성공한 뒤에만 호출)
    const updateComments = (fn) =>
        setBoardInfo(info => ({ ...info, comments: fn(info.comments || []) }));

    // 서버에 반영하다 실패했을 때: 안내 후, 글이 이미 사라졌다면(404) 목록으로 돌아가 새로 불러옴
    const handleBoardError = (error) => {
        alertError(error);
        if (error.response?.status === 404) {
            boardListView();
            loadBoard();
        }
    };

    // ▶ 댓글 등록
    const commentAdd = async () => {
        if (!loginUser) {
            alert('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
        if (commentText.trim() === '') return;
        try {
            const comment = await addCommentRequest(boardInfo.no, commentText.trim());
            updateComments(cs => [...cs, comment]);
            setCommentText('');
        } catch (error) {
            handleBoardError(error);
        }
    };

    // ▶ 댓글 수정 시작 (작성자만)
    const commentEditStart = (c) => {
        if (!loginUser || c.userId !== loginUser.id) return;
        setEditCommentId(c.id);
        setEditCommentText(c.content);
    };

    // ▶ 댓글 수정 저장 (작성자만 - 서버도 한 번 더 확인)
    const commentUpdate = async () => {
        if (editCommentText.trim() === '') return;
        try {
            const saved = await updateCommentRequest(editCommentId, editCommentText.trim());
            updateComments(cs => cs.map(c => (c.id === saved.id ? saved : c)));
            setEditCommentId(null);
            setEditCommentText('');
        } catch (error) {
            handleBoardError(error);
        }
    };

    // ▶ 댓글 삭제 (작성자만 - 서버도 한 번 더 확인)
    const commentDelete = async (id) => {
        try {
            await deleteCommentRequest(id);
            updateComments(cs => cs.filter(c => c.id !== id));
        } catch (error) {
            handleBoardError(error);
        }
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
    const boardRead = async (no) => {
        try {
            // 1) 서버가 조회수를 1 올리고 글과 댓글을 돌려줌
            const post = await readPostRequest(no);

            // 2) 목록의 조회수도 서버 값으로 맞춤
            setBoardList(list => list.map(b =>
                b.no === no ? { ...b, viewCount: post.viewCount } : b
            ));

            // 3) 읽기 화면에 보여줄 게시글 정보 저장 후 화면 전환
            setBoardInfo(post);
            setEditCommentId(null);
            setCommentText('');
            setListOk(false);
            setWriteOk(false);
            setEditOk(false);
            setReadOk(true);
        } catch (error) {
            handleBoardError(error);
        }
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
    const boardSave = async () => {
        if (!loginUser) {
            setErrorMessage('로그인 후 작성할 수 있습니다.');
            return;
        }
        // 1) 유효성 검사: 제목이나 내용이 비어 있으면 경고
        if (title.trim() === '' || description.trim() === '') {
            setErrorMessage('제목과 내용을 모두 입력해주세요!');
            return; // 저장 막기
        }

        // 2) 서버에 저장 (번호, 작성자, 조회수, 첨부 냥바구니 스냅샷은 서버가 정함)
        let newBoard;
        try {
            newBoard = await createPostRequest({ title, description, basketIds });
        } catch (error) {
            alertError(error);
            return; // 실패하면 작성 화면에 입력 내용이 그대로 남음
        }

        // 3) 기존 리스트에 새 글 추가 (불변성 유지)
        setBoardList(list => [...list, newBoard]);

        // 4) 입력창 초기화
        setTitle('');
        setDescription('');
        setErrorMessage(''); // 오류 메시지도 초기화

        // 5) 다시 목록 화면으로 이동
        boardListView();
    };

    // ▶ 게시글 삭제 기능
    const boardDelete = async (no) => {
        const target = boardList.find(b => b.no === no);
        if (!target || !isOwner(target)) {
            alert('작성자만 삭제할 수 있습니다.');
            return;
        }
        try {
            await deletePostRequest(no);
        } catch (error) {
            handleBoardError(error);
            return;
        }

        // 전달받은 번호와 다른 게시글만 남기고 필터링 → 해당 글 삭제 효과
        setBoardList(list => list.filter(b => b.no !== no));

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
    const updateBoard = async () => {
        // 서버에 저장 (작성자 확인과 첨부 냥바구니 스냅샷 생성은 서버가 함)
        let saved;
        try {
            saved = await updatePostRequest(editNo, {
                title: editTitle,
                description: editDescription,
                basketIds: editBasketIds,
            });
        } catch (error) {
            handleBoardError(error);
            return; // 실패하면 수정 화면에 입력 내용이 그대로 남음
        }

        // map을 돌며 수정 대상 번호와 일치하면 서버가 돌려준 글로 교체
        setBoardList(list => list.map(b => (b.no === editNo ? { ...b, ...saved } : b)));

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
                    {loadError && (
                        <Alert variant="danger">
                            {loadError}{' '}
                            <Button size="sm" variant="outline-danger" onClick={loadBoard}>다시 시도</Button>
                        </Alert>
                    )}
                    {loading && <div className="text-muted">게시글을 불러오는 중입니다...</div>}
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