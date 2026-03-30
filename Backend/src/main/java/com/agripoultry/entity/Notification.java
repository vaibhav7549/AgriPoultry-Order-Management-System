package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dbId;

    @Column(name = "notif_id", unique = true, length = 20)
    private String notifId;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "time_label", length = 50)
    private String time;

    @Column(name = "is_read")
    private Boolean read;

    @Column(name = "notif_type", length = 30)
    private String type;

    @Column(name = "user_id_code", length = 20)
    private String userIdCode;
}
