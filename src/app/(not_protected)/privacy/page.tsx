"use client";
import React from "react";
import Terms from "@/content/terms.mdx";
import constants from "../../../../constants";

const page = () => {
  return (
    <section className="m-16 w-full px-6 sm:px-0">
      <h2 className="text-5xl font-bold">Privacy Policy</h2>
      <br />
      <h4 className="text-xl text-muted-foreground">
        The Privacy Policy for {constants.name}.
      </h4>
      <hr className="my-4" />
      <p>
        At {constants.name}, your privacy is a top priority. This Privacy Policy
        outlines how we collect, use, and safeguard your personal information
        when you interact with our services. By using SeoulCompass, you agree to
        the terms outlined in this policy.
      </p>
      <br />
      <br />
      <h2 className="text-2xl font-bold">Consent</h2>
      <hr className="mt-2 mb-4" />
      <p>
        By using our platform, you consent to the collection, use, and
        disclosure of your information as described in this Privacy Policy. Your
        continued use of SeoulCompass signifies your agreement to the terms
        outlined here. If you do not agree with these terms, please refrain from
        using our services. We may update this Privacy Policy from time to time
        to reflect changes in our practices or for other operational, legal, or
        regulatory reasons. Any changes will be effective immediately upon
        posting on this page. We encourage you to review this policy
        periodically to stay informed about how we are protecting your
        information.
      </p>
      <br />
      <h2 className="text-2xl font-bold">Information We Collect</h2>
      <hr className="mt-2 mb-4" />
      <p className=" mb-4">
        To provide and improve our services, we collect different types of
        information from our users. This includes:
      </p>
      <ul className="list-disc pl-8 space-y-2">
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, and other contact details you provide during account
          registration or interaction with our platform.
        </li>
        <li>
          <strong>Usage Information:</strong> Data about your interactions with
          SeoulCompass, such as pages visited, features used, and time spent on
          the platform.
        </li>
        <li>
          <strong>Location Data:</strong> If enabled, we may collect real-time
          location data to provide you with personalized recommendations and
          services related to Seoul.
        </li>
        <li>
          <strong>Device Information:</strong> Information about your device,
          including IP address, operating system, browser type, and device
          identifiers, to ensure optimal performance.
        </li>
        <li>
          <strong>Payment Information:</strong> If you make purchases through
          our platform, we collect payment details securely processed through
          third-party payment providers.
        </li>
        <li>
          <strong>Communications:</strong> Messages, feedback, or support
          requests you send to us, including emails or in-app messages.
        </li>
        <li>
          <strong>Cookies and Tracking Technologies:</strong> We use cookies,
          web beacons, and similar technologies to collect information about
          your preferences and improve your browsing experience.
        </li>
      </ul>
      <br />
      <h2 className="text-2xl font-bold">How We Use Your Information</h2>
      <hr className="mt-2 mb-4" />
      <p className=" mb-4">
        We use the information collected to ensure the best possible experience
        for our users. Specifically, we use your information for the following
        purposes:
      </p>
      <ul className="list-disc pl-8 space-y-2">
        <li>
          <strong>To Provide and Improve Services:</strong> Deliver personalized
          content, features, and services tailored to your preferences and
          needs. Optimize the platform’s performance and user experience.
        </li>
        <li>
          <strong>For Communication:</strong> Respond to your inquiries,
          feedback, or support requests. Send service-related notifications,
          updates, or promotional materials (only if you have opted in).
        </li>
        <li>
          <strong>To Enhance User Experience:</strong> Analyze user behavior to
          improve the design, functionality, and usability of the platform.
          Offer location-specific recommendations for events, landmarks, or
          businesses in Seoul.
        </li>
        <li>
          <strong>For Security and Fraud Prevention:</strong> Protect user
          accounts and data from unauthorized access, cyber threats, or
          fraudulent activities. Conduct regular security checks to ensure
          compliance with legal and regulatory requirements.
        </li>
        <li>
          <strong>For Legal and Compliance Purposes:</strong> Fulfill our legal
          obligations, such as maintaining accurate transaction records or
          responding to lawful requests. Enforce our Terms and Conditions and
          protect our rights, property, and users.
        </li>
        <li>
          <strong>Marketing and Advertising:</strong> Provide you with targeted
          offers, discounts, or updates on services relevant to your interests.
          Conduct user satisfaction surveys to understand your preferences and
          improve our offerings.
        </li>
      </ul>
      <br />
      <h2 className="text-2xl font-bold">Your Rights</h2>
      <hr className="mt-2 mb-4" />
      <p>
        You have the right to access, update, or delete your personal
        information. You may also choose to opt out of certain data processing
        activities, such as receiving marketing emails. For any questions or
        requests regarding your data, please contact us at{" "}
        <a
          href="mailto:contact@seoulcompass.com"
          className="text-primary font-semibold underline"
        >
          contact@seoulcompass.com
        </a>
        .
      </p>
      <br />
      <h2 className="text-2xl font-bold">Data Retention</h2>
      <hr className="mt-2 mb-4" />
      <p className=" mb-4">
        We retain your information only for as long as necessary to fulfill the
        purposes outlined in this policy or comply with legal obligations. Once
        the retention period expires, your data will be securely deleted or
        anonymized.
      </p>
    </section>
  );
};

export default page;
