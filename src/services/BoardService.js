import HttpService from "services/HttpService";

const BoardService = {
    async findById(boardId) {
        const { data } = await HttpService.get(`/boards/${boardId}`);
        return data;
    }
}

export default BoardService;
