import { HttpService, NotificationService } from "services";
import moment from "moment";

const IssuePeriodService = {
    async findAll(boardId, filter) {
        const params = {
            startDate: moment(filter.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: moment(filter.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        };

        const { data } = await HttpService.get(`/boards/${boardId}/issue-periods`, { params });
        return data;
    },

    async create(boardId, issuePeriod) {
        try {
            const body = {
                startDate: issuePeriod.startDate,
                endDate: issuePeriod.endDate
            };

            await HttpService.post(`/boards/${boardId}/issue-periods`, body);
            NotificationService.notifySuccess("Período inserido com sucesso");

            return {};
        } catch ({ response }) {
            if (response.status === 400) {
                this._notifyCreateIssuePeriodErrors(response);
                return response.data;
            } else {
                NotificationService.notifyError("Falha ao cadastrar período");
                return {};
            }
        }
    },

    async delete(boardId, issuePeriodId) {
        try {
            await HttpService.delete(`/boards/${boardId}/issue-periods/${issuePeriodId}`);

            NotificationService.notifySuccess("Período removido com sucesso");
        } catch (error) {
            NotificationService.notifyError("Falha ao remover o período");
        }
    },

    async update(boardId, issuePeriodId) {
        try {
            await HttpService.put(`/boards/${boardId}/issue-periods/${issuePeriodId}`);

            NotificationService.notifySuccess("Período atualizado com sucesso");
            return {};
        } catch ({ response }) {
            if (response.status === 400) {
                this._notifyCreateIssuePeriodErrors(response);
                return response.data;
            } else {
                NotificationService.notifyError("Falha ao cadastrar período");
                return {};
            }
        }
    },

    _notifyCreateIssuePeriodErrors({ data }) {
        for (let [key, value] of Object.entries(data)) {
            value.forEach(error => {
                NotificationService.notifyError(`${key} - ${error}`);
            });
        }
    }

};

export default IssuePeriodService;
