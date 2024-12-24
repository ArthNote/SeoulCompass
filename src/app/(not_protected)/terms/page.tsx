"use client";
import React from "react";
import Terms from "@/content/terms.mdx";
import constants from "../../../../constants";

const page = () => {
  return (
    <section className="m-16 w-full px-6 sm:px-0">
      <h2 className="text-5xl font-bold">Terms & Conditions</h2>
      <br />
      <h4 className="text-xl text-muted-foreground">
        Read the terms and conditions of using our application.
      </h4>
      <hr className="my-4" />
      <p>
        Welcome to {constants.name}! By accessing, or using our application, you
        agree to abide by these Terms & Conditions. Please read them carefully
        as they contain important information regarding your legal rights,
        obligations, and limitations. If you do not agree to these terms, you
        may not access or use our services.
      </p>
      <br />
      <br />
      <h2 className="text-2xl font-bold">Legal Notices</h2>
      <hr className="mt-2 mb-4" />
      <p>
        The information provided on this website, including but not limited to
        text, graphics, and other material, is for general informational
        purposes only. While every effort is made to ensure the accuracy and
        completeness of the content, we make no guarantees, representations, or
        warranties of any kind, express or implied, about the accuracy,
        reliability, suitability, or availability of the website or the
        information contained within it. Any reliance you place on such
        information is strictly at your own risk. We reserve the right to modify
        or remove any content at any time without prior notice. By accessing or
        using this website, you agree to comply with all applicable laws and
        regulations. Unauthorized use of the website or its content may violate
        copyright, trademark, and other laws. All trademarks, logos, and service
        marks displayed on this site are the property of their respective owners
        and may not be used without explicit permission.
      </p>
      <br />
      <h2 className="text-2xl font-bold">Warranty Disclaimer</h2>
      <hr className="mt-2 mb-4" />
      <p>
        This website and its contents are provided "as is" and "as available"
        without any representations or warranties of any kind, either express or
        implied. To the fullest extent permissible under applicable law, we
        disclaim all warranties, express or implied, including but not limited
        to implied warranties of merchantability, fitness for a particular
        purpose, non-infringement, or that the website will be error-free,
        secure, or uninterrupted. We do not guarantee that the information
        provided on this website is up-to-date, free of errors, or complete.
        While we strive to protect user data and ensure a secure browsing
        experience, we cannot guarantee that the website or its servers are free
        from viruses or harmful components. You assume full responsibility for
        any damage to your devices or loss of data resulting from the use of the
        website.
      </p>
      <br />
      <h2 className="text-2xl font-bold">General</h2>
      <hr className="mt-2 mb-4" />
      <p>
        These terms and conditions constitute the entire agreement between you
        and us regarding the use of this website and supersede any prior
        agreements or understandings, whether written or oral, relating to such
        subject matter. Any failure to enforce or exercise any provision of
        these terms shall not constitute a waiver of such provision or any other
        provision. If any part of these terms and conditions is found to be
        invalid or unenforceable by a court of competent jurisdiction, the
        remaining provisions shall remain in full force and effect. These terms
        and conditions are governed by and construed in accordance with the laws
        of South Korea, without regard to its conflict of law principles. You
        agree to indemnify, defend, and hold harmless the website's owners,
        affiliates, partners, employees, and agents from and against any claims,
        damages, losses, or expenses, including reasonable attorneys' fees,
        arising out of or related to your use of the website or any violation of
        these terms and conditions.
      </p>
      <br />
      <h2 className="text-2xl font-bold">Disclaimer</h2>
      <hr className="mt-2 mb-4" />
      <p>
        he information provided on this website does not constitute legal,
        financial, or professional advice and should not be relied upon as such.
        Before making any decisions or taking any actions based on the
        information provided, you should consult with appropriate professionals
        who can provide advice tailored to your specific situation. We are not
        responsible for any loss or damage, including but not limited to
        indirect, consequential, or incidental loss or damage, arising from or
        in connection with the use of this website or its contents. This
        includes, without limitation, loss of data, revenue, profits, or
        business opportunities. Links to third-party websites may be provided
        for your convenience, but we do not endorse or assume responsibility for
        the content or practices of such sites. Accessing third-party websites
        is at your own risk, and we recommend reviewing their terms and
        conditions and privacy policies before use.
        <br />
        <br />
        If you have any questions or concerns regarding these terms and
        conditions, please contact us at{" "}
        <a
          href="mailto:contact@seoulcompass.com"
          className="text-primary font-semibold underline"
        >
          contact@seoulcompass.com
        </a>
        .
      </p>
    </section>
  );
};

export default page;
