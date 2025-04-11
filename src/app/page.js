"use client"

import Header from "@/components/common/Header";
import Content from "@/components/main_page/Content";
import Introduction from "@/components/main_page/Introduction";

export default function Home() {

  return (
    <div className="">
      <Introduction />
      <Header />
      <Content />
    </div>
  );
}
