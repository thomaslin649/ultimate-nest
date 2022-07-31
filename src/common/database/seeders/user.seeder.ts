import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { PostFactory } from "../factories/post.factory";
import { UserFactory } from "../factories/user.factory";
import { CommentFactory } from "../factories/comment.factory";

/* It creates a post, a user, and a comment */
export class UserSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		new UserFactory(em)
			.each(async user => {
				const comment = new CommentFactory(em).make(5, {
					author: user,
				});

				const posts = await new PostFactory(em).create(2, {
					author: user,
					comments: comment,
				});

				user.posts.set(posts);
			})
			.make(5);
	}
}
