import { useEffect, useState } from 'react';

import {
  useAppDispatch,
  useAppSelector,
  useErrorMessage,
} from '../../app/hooks';
import { changeLike } from '../../features/users/usersSlice';
import { Id } from '../../app/types';
import { Side } from './Side';

export const UsersCard: React.FC = () => {
  const users = useAppSelector((state) => state.users.users);
  const isLiking = useAppSelector((state) => state.users.isLiking);
  const likeError = useAppSelector((state) => state.users.likingError);

  useErrorMessage(likeError);

  const dispatch = useAppDispatch();

  const [isFrontSide, setIsFrontSide] = useState(true);
  const [frontSideUser, setFrontSideUser] = useState(
    users ? users[0] ?? null : null
  );
  const [backSideUser, setBackSideUser] = useState(
    users ? users[0] ?? null : null
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const [rotateAngle, setRotateAngle] = useState(0);
  const [isTransition, setIsTransition] = useState(false);

  useEffect(() => {
    const user = users?.[currentIndex] ?? null;

    if (isFrontSide) {
      setFrontSideUser(user);
    } else {
      setBackSideUser(user);
    }
  }, [currentIndex, isFrontSide, users]);

  const resetAngle = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'transform') {
      setIsTransition(false);
      if (rotateAngle === 360 || rotateAngle === -360) {
        setRotateAngle(0);
      }
    }
  };

  const rotateNext = () => {
    setIsTransition(true);
    setRotateAngle((prev) => prev + 180);
  };

  const rotateBack = () => {
    setIsTransition(true);
    setRotateAngle((prev) => prev - 180);
  };

  const nextClickHandler = () => {
    const user = users?.[currentIndex + 1] ?? null;

    if (isFrontSide) {
      setBackSideUser(user);
      setIsFrontSide(false);
    } else {
      setFrontSideUser(user);
      setIsFrontSide(true);
    }

    setCurrentIndex((prev) => prev + 1);
    rotateNext();
  };

  const backClickHandler = () => {
    const user = users?.[currentIndex - 1] ?? null;

    if (isFrontSide) {
      setBackSideUser(user);
      setIsFrontSide(false);
    } else {
      setFrontSideUser(user);
      setIsFrontSide(true);
    }

    setCurrentIndex((prev) => prev - 1);
    rotateBack();
  };

  const likeClickHandler = (id: Id) => {
    dispatch(changeLike(id));
  };

  const refreshClickHandler = () => {
    if (users?.length) {
      if (isFrontSide) {
        setBackSideUser(users[0]);
        setIsFrontSide(false);
      } else {
        setFrontSideUser(users[0]);
        setIsFrontSide(true);
      }

      setCurrentIndex(0);
      rotateNext();
    }
  };

  return (
    <div
      className="w-96 relative"
      style={{
        transition: isTransition ? 'transform 2s' : '',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotateAngle}deg)`,
      }}
      onTransitionEnd={resetAngle}
    >
      <Side
        type="front"
        user={frontSideUser}
        isLoading={isLiking}
        onBack={backClickHandler}
        onLike={likeClickHandler}
        onNext={nextClickHandler}
        onRefresh={refreshClickHandler}
        disablebuttons={isTransition}
      />
      <Side
        type="back"
        user={backSideUser}
        isLoading={isLiking}
        onBack={backClickHandler}
        onLike={likeClickHandler}
        onNext={nextClickHandler}
        onRefresh={refreshClickHandler}
        disablebuttons={isTransition}
      />
    </div>
  );
};
