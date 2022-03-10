import React from "react";
import ContentLoader from "react-content-loader";

const AvatarLoader = (props) => (
  <ContentLoader
    speed={2}
    width={60}
    height={48}
    viewBox="0 0 60 48"
    backgroundColor="#333"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
    <circle cx="28" cy="26" r="20" />
    <rect x="74" y="95" rx="0" ry="0" width="47" height="63" />
    <rect x="208" y="20" rx="0" ry="0" width="97" height="15" />
    <rect x="319" y="-18" rx="0" ry="0" width="74" height="21" />
  </ContentLoader>
);

export { AvatarLoader };
