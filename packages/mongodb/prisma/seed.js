/* eslint-disable no-undef */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create Users
  await prisma.user.createMany({
    data: [
      {
        id: "c185395093969377392vc4bj5sg5",
        role: "ACCEPTOR",
        fullname: "Rajesh",
        phoneNum: "9916180493",
        selfie: "https://avatar.vercel.sh/rajesh",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
        email: "rajesh@example.com",
        createdAt: "2024-10-27T18:32:59.231+00:00"
      },
      {
        id: "c25511446658370rh7mjqp57lq51",
        role: "ACCEPTOR",
        fullname: "Venkatesh",
        phoneNum: "7382582834",
        selfie: "https://avatar.vercel.sh/venkatesh",
        location: { type: "Point", coordinates: [78.4772, 17.4065] },
        email: "venkatesh@example.com",
        createdAt: "2024-11-12T05:17:42.987+00:00"
      }
    ]
  });

  await prisma.user.createMany({
    data: [
      {
        id: "c7003604724268x7j2k8ur45gpw5",
        role: "DONOR",
        fullname: "Mahaboob Basha",
        phoneNum: "7799584615",
        selfie: "https://avatar.vercel.sh/basha",
        location: { type: "Point", coordinates: [75.3412, 33.2778] },
        email: "mahaboob_basha@example.com",
        createdAt: "2024-12-03T14:55:01.563+00:00"
      },
      {
        id: "c7611147767435cijxzb2na25new",
        role: "DONOR",
        fullname: "Shameem",
        phoneNum: "9440365688",
        selfie: "https://avatar.vercel.sh/shameem",
        location: { type: "Point", coordinates: [77.6017, 14.6824] },
        email: "shameem@example.com",
        createdAt: "2024-10-09T02:08:23.719+00:00"
      }
    ]
  });

  await prisma.user.create({
    data: {
      id: "cm4y66yax0002t5flhwe2teb3",
      role: "VERIFIER",
      fullname: "Sadiq Vali",
      phoneNum: "8309157924",
      selfie: "https://avatar.vercel.sh/emilyclark_selfie.jpg",
      location: { type: "Point", coordinates: [-77.0369, 38.9072] },
      email: "rebirth4vali@gmail.com",
      createdAt: "2024-11-29T21:41:38.005+00:00"
    }
  });

  // Create Tweets
  await prisma.tweet.createMany({
    data: [
      {
        id: "c6693004794343p5qw4flwgt6ym4",
        text: `Assalamualaikum, @Abeed #everyone.I’m sharing a genuine Zakat application for someone who has worked in my shop for 10 years. I’ve already given my full Zakat amount elsewhere on this platform, so I can’t contribute further. Otherwise, I would have fully supported him myself.

Link to the zakaat Applicant
https://www.zakaat.com/zakaat-application/bismilla`,
        authorId: "c7003604724268x7j2k8ur45gpw5",
        createdAt: "2024-12-19T11:26:54.347+00:00"
      },
      {
        id: "c7859434292703tma6q4po4xkw85",
        text: `Assalamualaikum, #everyone.I’m sharing a genuine Zakat application for someone whom i know personally and is a deserving zakaat reciepient.

Link to the zakaat Applicant
https://www.zakaat.com/zakaat-application/bismilla`,
        authorId: "c7611147767435cijxzb2na25new",
        createdAt: "2024-10-16T09:03:17.891+00:00"
      }
    ]
  });

  // Create Applications
  await prisma.application.createMany({
    data: [
      {
        id: "c0682585848104pvy8rnikfzl449",
        authorId: "c185395093969377392vc4bj5sg5",
        amount: 5000,
        reason:
          "Aisha Begum, a 45-year-old widow, struggles to raise her three children with a monthly income of ₹6,000. Due to unpaid school fees, her children risk losing access to education. Aisha requests ₹20,000 to cover the overdue fees and purchase necessary school supplies. This financial support will help her children continue their studies and break the cycle of poverty, giving them hope for a brighter future.",
        status: "BOOKMARKED",
        hide: true,
        bookmarkedUserId: "cm4y66yax0002t5flhwe2teb3",
        verifierUserId: "cm4y66yax0002t5flhwe2teb3",
        rating: 8,
        createdAt: "2024-11-05T17:39:29.623+00:00"
      },
      {
        id: "c6264624352590rtwy9ph62w0711",
        authorId: "c25511446658370rh7mjqp57lq51",
        amount: 3000,
        reason:
          "Mohammed Irfan, 28, lost his job and is struggling to support his elderly parents. He plans to start a tailoring shop but lacks ₹50,000 for equipment and materials. With verified skills, he hopes to achieve financial independence. This small investment will help him build a business, support his family, and contribute to the community. Your Zakaat can provide Irfan with the opportunity to regain his stability and self-reliance.",
        status: "VERIFIED",
        hide: false,
        verifierUserId: "cm4y66yax0002t5flhwe2teb3",
        rating: 4,
        createdAt: "2024-12-24T07:14:46.159+00:00"
      },
      {
        id: "c6547879684934w1x884995cmazw",
        authorId: "c25511446658370rh7mjqp57lq51",
        amount: 3000,
        reason:
          "Fatima Khatoon, a 60-year-old widow, is facing severe vision problems due to cataracts and requires ₹25,000 for surgery. Living alone, she has no family support and relies on charity. The surgery is her only chance to restore her sight and independence. Without it, she risks permanent blindness. Your Zakaat will help her regain her vision and dignity, enabling her to live independently and with hope for the future.",
        status: "DONATED",
        hide: false,
        donatedUserId: "cm4y66yax0002t5flhwe2teb3",
        verifierUserId: "cm4y66yax0002t5flhwe2teb3",
        rating: 6,
        createdAt: "2024-10-31T23:50:08.475+00:00"
      }
    ]
  });

  // Create Connection
  await prisma.connection.create({
    data: {
      id: "c9016037831458ljzwfhqnhblb4n",
      from: "cm4y66yax0002t5flhwe2teb3",
      to: "c7003604724268x7j2k8ur45gpw5"
    }
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
