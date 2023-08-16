import type { Faker } from "@mikro-orm/seeder";
import { Factory } from "@mikro-orm/seeder";
import { randomNumber } from "helper-fns";
import { Comment } from "@entities";

/* `CommentFactory` is a factory that creates `Comment` instances */
export class CommentFactory extends Factory<Comment> {
  model = Comment;

  definition(faker: Faker): Partial<Comment> {
    return {
      body: faker.lorem.words(randomNumber(4, 8)),
    };
  }
}
