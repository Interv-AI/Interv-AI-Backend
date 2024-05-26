import { questionModel, IQuestion } from "../../models/Questions";

class QuestionService {
    async getQuestionByDomain(domain: string) {
        const aggregationPipeline = [
            { $match: { domain: domain } },
            { $limit: 10 },
            { $sample: { size: 10 } }
        ];
        const res: IQuestion[] = await questionModel.aggregate(aggregationPipeline).exec();
        return res;
    }
    async getQuestionById(question_id: number) {
        const res: any = await questionModel.find({ question_id: { $eq: question_id } });
        return res;
    }
}

export default QuestionService;