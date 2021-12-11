import React, { Component } from 'react';

const initData = {
    pre_heading: "Auctions",
    heading: "Live Auctions",
    content: "",
    btnText: "Load More"
}

const data = [
    {
        id: "1",
        img: "/img/auction_1.jpg",
        date: "2021-12-09",
        title: "Virtual Worlds",
        seller_thumb: "/img/avatar_1.jpg",
        seller: "@Richard",
        price: "1.5 BNB",
        count: "1 of 1"
    },
    {
        id: "2",
        img: "/img/auction_2.jpg",
        date: "2021-10-05",
        title: "Collectibles",
        seller_thumb: "/img/avatar_2.jpg",
        seller: "@JohnDeo",
        price: "2.7 BNB",
        count: "1 of 1"
    },
    {
        id: "3",
        img: "/img/auction_3.jpg",
        date: "2021-09-15",
        title: "Arts",
        seller_thumb: "/img/avatar_3.jpg",
        seller: "@MKHblots",
        price: "2.3 BNB",
        count: "1 of 1"
    },
    {
        id: "4",
        img: "/img/auction_4.jpg",
        date: "2021-12-29",
        title: "Robotic Arts",
        seller_thumb: "/img/avatar_4.jpg",
        seller: "@RioArham",
        price: "1.8 BNB",
        count: "1 of 1"
    },
    {
        id: "5",
        img: "/img/auction_5.jpg",
        date: "2022-01-24",
        title: "Magazine Fall",
        seller_thumb: "/img/avatar_5.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "6",
        img: "/img/auction_6.jpg",
        date: "2022-03-30",
        title: "Inspiration",
        seller_thumb: "/img/avatar_6.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "7",
        img: "/img/auction_7.jpg",
        date: "2022-01-24",
        title: "Design Illusions",
        seller_thumb: "/img/avatar_7.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "8",
        img: "/img/auction_8.jpg",
        date: "2022-03-30",
        title: "Design Illusions",
        seller_thumb: "/img/avatar_8.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "9",
        img: "/img/auction_9.jpg",
        date: "2022-03-30",
        title: "Design Illusions",
        seller_thumb: "/img/avatar_4.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "10",
        img: "/img/auction_10.jpg",
        date: "2022-03-30",
        title: "Infinity",
        seller_thumb: "/img/avatar_1.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "11",
        img: "/img/auction_11.jpg",
        date: "2022-01-24",
        title: "Sports",
        seller_thumb: "/img/avatar_2.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    },
    {
        id: "12",
        img: "/img/auction_12.jpg",
        date: "2022-03-30",
        title: "Characteristics",
        seller_thumb: "/img/avatar_3.jpg",
        seller: "@ArtNox",
        price: "1.7 BNB",
        count: "1 of 1"
    }
]

class AuctionsTwo extends Component {
    state = {
        initData: {},
        data: []
    }
    componentDidMount(){
        this.setState({
            initData: initData,
            data: data
        })
    }
    render() {
        return (
            <section className="live-auctions-area load-more padding-wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            {/* Intro */}
                            <div className="intro text-center">
                                <span>{this.state.initData.pre_heading}</span>
                                <h3 className="mt-3 mb-0">{this.state.initData.heading}</h3>
                                <p>{this.state.initData.content}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row items">
                        {this.state.data.map((item, idx) => {
                            return (
                                <div key={`auct_${idx}`} className="col-12 col-sm-6 col-lg-3 item">
                                    <div className="card">
                                        <div className="image-over">
                                            <a href="/item-details">
                                                <img className="card-img-top" src={item.img} alt="" />
                                            </a>
                                        </div>
                                        {/* Card Caption */}
                                        <div className="card-caption col-12 p-0">
                                            {/* Card Body */}
                                            <div className="card-body">
                                                <div className="countdown-times mb-3">
                                                    <div className="countdown d-flex justify-content-center" data-date={item.date} />
                                                </div>
                                                <a href="/item-details">
                                                    <h5 className="mb-0">{item.title}</h5>
                                                </a>
                                                <a className="seller d-flex align-items-center my-3" href="/author">
                                                    <img className="avatar-sm rounded-circle" src={item.seller_thumb} alt="" />
                                                    <span className="ml-2">{item.seller}</span>
                                                </a>
                                                <div className="card-bottom d-flex justify-content-between">
                                                    <span>{item.price}</span>
                                                    <span>{item.count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <a id="load-btn" className="btn btn-bordered-white mt-5" href="#">{this.state.initData.btnText}</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default AuctionsTwo;