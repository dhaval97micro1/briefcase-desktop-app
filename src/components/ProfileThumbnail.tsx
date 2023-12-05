const ProfileThumbnail = (user: {
  image?: string;
  firstName?: string;
  lastName?: string;
}) => {
  if (user?.image) {
    return (
      <img
        src={user?.image}
        className="h-12 w-12 rounded-full"
        alt="profile-avatar"
      />
    );
  }
  return (
    <div className="h-12 w-12 rounded-full flex justify-center items-center">
      {(user?.firstName + " " + user?.lastName)
        ?.split(" ")
        ?.slice(0, 2)
        ?.map((n) => n[0])}
    </div>
  );
};

export default ProfileThumbnail;
