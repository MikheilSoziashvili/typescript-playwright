import { BetTestDataObjectFactory } from "./factories/bet-test-data-object-factory";
import { BlogPostTestDataObjectFactory } from "./factories/blog-post-test-data-object-factory";
import { FreeSpinsPromotionTestDataObjectFactory } from "./factories/free-spins-promotion-test-data-object-factory";
import { PromotionTestDataObjectFactory } from "./factories/promotion-test-data-object-factory";
import { RegisterTestDataObjectFactory } from "./factories/register-test-data-object-factory";
import { SportsBlogArticleTestDataObjectFactory } from "./factories/sports-blog-article-test-data-object-factory";

export const objectFactoryRegistry = {
	bet: BetTestDataObjectFactory,
	register: RegisterTestDataObjectFactory,
	freeSpinsPromotion: FreeSpinsPromotionTestDataObjectFactory,
	blogArticle: SportsBlogArticleTestDataObjectFactory,
	blogPost: BlogPostTestDataObjectFactory,
	promotions: PromotionTestDataObjectFactory,
};
