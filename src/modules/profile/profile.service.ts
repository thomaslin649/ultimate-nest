import { BaseRepository } from "@common/database/base.repository";
import { IProfileData } from "@common/types/interfaces";
import { User } from "@entities";
import { AutoPath } from "@mikro-orm/core/typings";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { from, map, Observable, switchMap } from "rxjs";

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(User)
		private userRepository: BaseRepository<User>,
		private readonly i18nService: I18nService,
	) {}

	/* Finding a profile by username*/
	getProfileByUsername(
		username: string,
		populate: AutoPath<User, keyof User>[] = [],
	): Observable<User> {
		return from(
			this.userRepository.findOne(
				{
					username,
					isObsolete: false,
					isActive: true,
				},
				{ populate },
			),
		).pipe(
			map(user => {
				if (!user) {
					throw new NotFoundException(
						this.i18nService.t("exception.itemDoesNotExist", {
							args: { item: "Profile" },
						}),
					);
				}

				return user;
			}),
		);
	}

	/**
	 * It takes a logged in user and a username to follow, and returns an observable of the profile data
	 * of the user that was followed
	 * @param {User} loggedInUser - User - The user that is currently logged in.
	 * @param {string} usernameToFollow - The username of the user to follow.
	 * @returns A profile object with the following properties:
	 * 	following: true,
	 * 	avatar: followingUser.avatar,
	 * 	username: followingUser.username,
	 */
	follow(loggedInUser: User, usernameToFollow: string): Observable<IProfileData> {
		if (!usernameToFollow) {
			throw new BadRequestException("Follower username not provided.");
		}

		const followingUser$ = this.getProfileByUsername(usernameToFollow, ["followers"]);

		return followingUser$.pipe(
			switchMap(followingUser => {
				if (loggedInUser.username === usernameToFollow) {
					throw new BadRequestException(
						this.i18nService.t("exception.cantfollowYourself"),
					);
				}

				followingUser.followers.add(loggedInUser);

				const profile: IProfileData = {
					following: true,
					avatar: followingUser.avatar,
					username: followingUser.username,
				};

				return from(this.userRepository.flush()).pipe(map(() => profile));
			}),
		);
	}

	/**
	 * It takes a followerId and a username, finds the user with the given username, removes the user with
	 * the given followerId from the followers list of the user with the given username, and returns a
	 * profile object
	 * @param {number} followerId - The id of the user who is following the other user.
	 * @param {string} username - The username of the user you want to follow.
	 * @returns An observable of type IProfileData
	 */
	unFollow(followerId: number, username: string): Observable<IProfileData> {
		if (!followerId || !username) {
			throw new BadRequestException("FollowerId and username not provided.");
		}

		const followingUser$ = this.getProfileByUsername(username, ["followers"]);

		return followingUser$.pipe(
			switchMap(followingUser => {
				const followerUser = this.userRepository.getReference(followerId);

				if (followingUser.id === followerId) {
					throw new BadRequestException("FollowerId and FollowingId cannot be equal.");
				}

				followingUser.followers.remove(followerUser);

				const profile: IProfileData = {
					following: false,
					avatar: followingUser.avatar,
					username: followingUser.username,
				};

				return from(this.userRepository.flush()).pipe(map(() => profile));
			}),
		);
	}
}
