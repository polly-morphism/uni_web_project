import { template } from '../../app/api';
import {
  Id,
  LikeInfo,
  User,
  WithId,
  WithIsLiked,
  WithPhoto,
} from '../../app/types';

export const usersAPI = {
  getUsers: (id: Id) => {
    return template.get<(User & WithPhoto & WithIsLiked & WithId)[]>(
      `/list/${id}/`
    );
  },

  changeLike: (likerId: Id, likedId: Id) => {
    return template.post<LikeInfo[]>(`${likerId}/${likedId}/like/`);
  },

  getLikes: (id: Id) => {
    return template.get<LikeInfo[]>(`/${id}/${id}/like/`);
  },
};
